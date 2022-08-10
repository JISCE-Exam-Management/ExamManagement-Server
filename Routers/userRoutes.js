const express = require('express');
const router = express.Router();
const User = require('../Models/userModel');
const BaseError = require('../Helpers/errors');

router.get('/all', async(req, res)=> {
    try {
        res.status(200).json((await User.find(req.body, {password: 0})).sort((a,b) => a.verified - b.verified));
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/', async(req, res)=> {
    try {
        res.status(200).json(await User.findById(req.query.user, {password: 0}));
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/signup', async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if (user) throw new BaseError("User already exists with this email!");
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
            } else throw new BaseError("Incorrect password!");
        } else throw new BaseError("No user found!");
    } catch (err) {
        res.status(400).send(err);
    }
});

router.patch('/update', async(req, res)=> {
    try {
        res.status(200).json(await User.findByIdAndUpdate(req.query.user, req.body, {new: true}));
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete('/delete', async(req, res)=> {
    try {
        res.status(200).json(await User.findByIdAndDelete(req.query.user));
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;