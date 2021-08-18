const {Order} = require('../models/order');
const {OrderItem} = require('../models/orderItem');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res)=>{
    const orderList = await Order.find().populate('user', 'name').sort({'dateOrdered': -1});

    if(!orderList ){
        res.status(500).json({success: false});
    }

    res.send(orderList);
});

router.get('/:id', async(req, res)=>{
    const order = await Order.findById(req.params.id).populate('user', 'name').populate({path:'orderItems', populate: {path: 'product', populate: 'category'}});

    if(!order){
        return res.status(404).send("Order with the given Id cannot be found!");
    }

    res.send(order);
})

router.post('/', async (req, res)=>{
    const orderItemIds = Promise.all(req.body.orderItems.map(async orderItem =>{
        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        });

       newOrderItem = await newOrderItem.save();

        return newOrderItem._id;
    }))

    const orderItemIdsResolved = await orderItemIds;

    const totalPrices = await Promise.all(orderItemIdsResolved.map(async (orderItemId)=>{
        const orderItems = await OrderItem.findById(orderItemId).populate('product', 'price');
        const totalPrice =  orderItems.product.price * orderItems.quantity;
        return totalPrice;
    }))

    const totalPrice = totalPrices.reduce((a,b)=>a+b,0);



    let order = new Order({
        orderItems: orderItemIdsResolved,
        shippingAddr1: req.body.shippingAddr1,
        shippingAddr2: req.body.shippingAddr2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        user: req.body.user,
        totalPrice: totalPrice,
        dateOrdered: req.body.dateOrdered
    });

    order = await order.save();

    if(!order){return res.status(404).send('Order cannot be created');}

    res.send(order);
})


router.put('/:id', async(req, res)=>{
    const order = await Order.findByIdAndUpdate(req.params.id, {
        status : req.body.status
    }, {new : true});

    if(!order){return res.status(404).json({success: false});}
    res.send(order);
})

router.delete('/:id', (req, res)=>{
    Order.findByIdAndRemove(req.params.id).then(async order=>{
        if(order){
            await order.OrderItem.map(async orderItem =>{
                await OrderItem.findByIdAndRemove(orderItem)
            })
            return res.status(200).json({success: true, message: 'The Order was deleted successfully'});
        }else{
            return res.status(404).json({success: false, message: 'The order delete was unsuccessful'})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err});
    })
})

router.get('/get/totalsales', async(req, res)=>{
    const totalSales = await Order.aggregate([
        {$group: {_id: null, totalsales: {$sum : '$totalPrice'}}}
    ])

    if(!totalSales){
       return res.status(400).send('The total sales cannot be generated');
    }

    //res.send({totalsales: totalSales}); Or ==> next line method
    res.send({totalsales: totalSales.pop().totalsales});
})

router.get('/get/count', async(req, res)=>{
    const orderCount = await Order.countDocuments((count)=>count)

    if(!orderCount){
        return res.status(500).json({success: false, message: 'There is no order in store'})
    }else{
        return res.send({orderCount: orderCount}); 
    }
})

router.get('/get/userorders/:userid', async (req, res)=>{
    const userOrderList = await Order.find({user: req.params.userid}).populate({path: 'orderItems', 
    populate:{path: 'product', populate: 'category'}}).sort({'dateOrdered': -1});

    if(!userOrderList ){
        res.status(500).json({success: false});
    }

    res.send(userOrderList);
});

module.exports = router