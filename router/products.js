// for every model... there should be a router
const {Product} = require('../models/product');
const {Category} = require('../models/category');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');


const FILE_TYPE_MAP = {
    'image/png' : 'png',
    'image/jpeg': 'jpeg',
    'image/jpg' : 'jpg'
}
const storage = multer.diskStorage({
    destination: function(req,file, cb){
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if(isValid){uploadError = null;}
        cb(uploadError, 'public/uploads');
    },
    filename: function(req,file, cb){
        const fileName = file.originalname.split(' ').join('_');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}` )
    }
})

const uploadOption = multer({storage: storage});


router.get('/', async (req, res)=>{
    let filter = {};
    if(req.query.categories)
    {
        filter= {category: req.query.categories.split(',')}
    }
    const productList = await Product.find(filter).populate('category');

    if(!productList){
        res.status(500).json({success: false})
    }

    res.send(productList);
});

router.post('/', uploadOption.single('image'),async (req, res)=>{
    const category =  await Category.findById(req.body.category);
    if(!category){
        return res.status(400).send('Invalid category Id provided');
    }

    const file = req.file;
    if(!file){ return res.status(404).send('no image in the request')}

    const fileName = req.file.filename
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    const product = new Product({
        name: req.body.name,
        image: `${basePath}${fileName}`,
        countInStock: req.body.countInStock,
        description: req.body.description,
        richDescription: req.body.richDescription,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        rating: req.body.rating,
        isFeatured: req.body.isFeatured,
        dateCreated: req.body.dateCreated,
    })

    //<=====Reduce list display====>
    // const product = new Product({
    //     name: req.body.name,
    //     image: req.body.image,
    //     countInStock: req.body.countInStock,
    //     description: req.body.description,
    //     richDescription: req.body.richDescription,
    //     brand: req.body.brand,
    //     price: req.body.price,
    //     category: req.body.category,
    //     rating: req.body.rating,
    //     isFeatured: req.body.isFeatured,
    //     dateCreated: req.body.dateCreated,
    // }).select('name image')   or .select('name image -_id');



    // product.save().then((createdProduct)=>{
    //     res.status(201).json(createdProduct);
    // }).catch((err)=>{
    //     res.status(500).json({
    //         error: err,
    //         success: false
    //     })
    // })

    product = await Product.save();

    if(!product){ return res.status(404).json({success: false, message: 'Product with the provided cannot be updated!'})}

    res.status(200).send(product);
});

router.get('/:id', async(req, res)=>{
    const product = await Product.findById(req.params.id).populate('category');

    if(!product){ return res.status(404).json({success: false, message: 'Product with the given Id cannot be found!'});}

    res.status(200).send(product);
});

router.put('/:id', async(req, res)=>{
    if(!mongoose.isValidObjectId(req.params.id))
    {
        res.status(400).send('Invalid product Id');
    }
    const category = await Category.findById(req.body.category);
    if(!category){
        return res.status(400).send('Invalid category Id provided');
    }


    const product = await Product.findByIdAndUpdate(req.params.id,{
        name: req.body.name,
        image: req.body.image,
        description: req.body.description,
        richDescription: req.body.richDescription,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        rating: req.body.rating,
        isFeatured: req.body.isFeatured,
        dateCreated: req.body.dateCreated,
    }, {new: true});

    if(!product){ return res.status(404).json({success: false, message: 'Product with the provided cannot be updated!'})}

    res.status(200).send(product);
});

router.delete('/:id', async(req, res)=>{
    const product = await Product.findByIdAndRemove(req.params.id);

    if(!product){return res.status(404).json({success: false, message: 'Product with above Id Delete was unsuccessful'});}

res.status(200).json({success: true, message: 'product deleted successfully!'});
});


router.get('/get/count', async (req, res)=>{
    const productCount = await Product.countDocuments((counts)=> counts);

    if(!productCount){
        res.status(500).json({success: false})
    }

    res.send({ProductCount: productCount});
});

router.get('/get/featured/:count', async (req, res)=>{
    const count = req.params.count ? req.params.count : 0;

    const productCount = await Product.find({isFeatured : true}).limit(+count);

    if(!productCount){
        res.status(500).json({success: false})
    }

    res.send({ProductCount: productCount});
});

router.put('/gallery-images/:id', uploadOption.array('images', 10), async(req,res)=>{
    if(!mongoose.isValidObjectId(req.params.id))
    {
        res.status(400).send('Invalid product Id');
    }

    const files = req.files;
    let imagePaths = [];
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    if(files)
    {
        files.map(file=>{
            imagesPath.push(`${basePath}${file.fileName}`);
        })
    }

    const product = await Product.findByIdAndUpdate(req.params.id,{
        images: imagePaths
    }, {new: true});

    if(!product){ return res.status(404).json({success: false, message: 'Product with the provided cannot be updated!'})}

    res.status(200).send(product);


});


module.exports = router