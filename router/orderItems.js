const {OrderItem} = require('../models/orderItem');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res)=>{
    const orderItemList = await OrderItem.find();

    if(!orderItemList){ res.status(500).json({success: false});}

    res.send(orderItemList);
});


module.exports = router;