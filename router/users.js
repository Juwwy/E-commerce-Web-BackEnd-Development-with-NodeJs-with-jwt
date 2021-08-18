const {User} = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')


router.get('/', async(req, res)=>{
    const userList = await User.find().select('-password');

    if(!userList)
    {
        res.status(500).json({success:false});
    
    }

    res.send(userList);
});

router.post('/', async(req, res)=>{
    let user = new User({
        name : req.body.name,
        email : req.body.email,
        password: bcrypt.hashSync(req.body.password, 10) ,
        street: req.body.street,
        city: req.body.city,
        apartment: req.body.apartment,
        country: req.body.country,
        phone: req.body.phone,
        isAdmin: req.body.isAdmin

    });

    user = await user.save();

    if(!user){
        return res.status(500).json({success: false, message: 'User cannot be created'});
    }

    res.status(200).send(user);
    
});

router.get('/:id', async(req, res)=>{
    let user = await User.findById(req.params.id).select('name email phone');

    if(!user){ return res.status(404).json({success: false, message: "No User found with the above ID"});}

    res.status(200).send(user);
})


router.post('/login', async(req, res)=>{
    const user = await User.findOne({email: req.body.email});

    const secret = process.env.secret;

    if(!user){ return res.status(400).send('Wrong email provided');}

    if(user && bcrypt.compareSync(req.body.password, user.password))
    {
        const token = jwt.sign({ userId: user.id, isAdmin: user.isAdmin}, secret, {expiresIn: '1w'});

        return res.status(200).send({email: user.email, token: token });
    }else { return res.status(404).send('user does not exist!');}
    
});

router.post('/register', async(req, res)=>{
    let user = new User({
        name : req.body.name,
        email : req.body.email,
        password: bcrypt.hashSync(req.body.password, 10) ,
        street: req.body.street,
        city: req.body.city,
        apartment: req.body.apartment,
        country: req.body.country,
        phone: req.body.phone,
        isAdmin: req.body.isAdmin

    });

    user = await user.save();

    if(!user){
        return res.status(500).json({success: false, message: 'User cannot be created'});
    }

    res.status(200).send(user);
    
});


router.get('/get/count', async (req, res)=>{
    const userCount = await User.countDocuments((counts)=> counts);

    if(!userCount){
        res.status(500).json({success: false})
    }

    res.send({userCount: userCount});
});

router.delete('/:id', async(req, res)=>{
    const user = await User.findByIdAndRemove(req.params.id);

    if(!user){return res.status(404).json({success: false, message: 'User with above Id Delete was unsuccessful'});}

res.status(200).json({success: true, message: 'User deleted successfully!'});
});

module.exports = router;