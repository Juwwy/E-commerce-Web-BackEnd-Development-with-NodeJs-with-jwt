const {Category} = require('../models/category');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res)=>{
    const categoryList = await Category.find();

    if(!categoryList){res.status(500).json({success: false});}

    res.send(categoryList);
});

router.get('/:id', async(req, res)=>{
    const category = await Category.findById(req.params.id);

    if(!category){ return res.status(500).json({success: false, message: 'Category with the above ID was not found'});}

    res.status(200).send(category);
})

router.post('/', async (req, res)=>{
    let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    });

    category = await category.save();

    if(!category){ return res.status(404).json({success: false, message: 'Category cannot be created'});}

    res.send(category);
})

router.put('/:id', async(req, res)=>{
    const category = await Category.findByIdAndUpdate(req.params.id, {
        name : req.body.name,
        color : req.body.color,
        icon : req.body.icon
    }, {new : true});

    if(!category){ return res.status(500).json({success: false, message: 'category cannot be found!'});}

    res.status(200).send(category);
})

router.delete('/:id', (req,res)=>{
Category.findByIdAndRemove(req.params.id).then(category =>{
    if(category){ return res.status(200).json({success: true, message: 'Category has been deleted successfully!'});}
    else{return res.status(404).json({success: false, message: 'Category not found!'});}
}).catch(err =>{
    res.status(400).json({success: false, Error: err});
})
})

module.exports = router;