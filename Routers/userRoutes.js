const express = require('express');
const router = express.Router();
const User = require('../Models/userModel');

router.get('/all', async(req, res)=> {
    try {
        res.status(200).json((await User.find()).sort((a,b) => a.verified - b.verified));
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/:id', async(req, res)=> {
    try {
        res.status(200).json(await User.findById(req.params.id));
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/signup', async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if (user) throw new Error("User already exists with this email!");
        else res.status(200).json(await new User(req.body).save());
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if (user) {
            if (user.password === req.body.password) {
                res.status(200).json(user);
            } else throw new Error("Incorrect password!");
        } else throw new Error("No user found!");
    } catch (err) {
        res.status(400).send(err);
    }
});

router.patch('/update/:id', async(req, res)=> {
    try {
        res.status(200).json(await User.findByIdAndUpdate(req.params.id, req.body, {new: true}));
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete('/delete/:id', async(req, res)=> {
    try {
        res.status(200).json(await User.findByIdAndDelete(req.params.id));
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;