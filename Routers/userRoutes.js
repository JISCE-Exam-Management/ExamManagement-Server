const express = require('express');
const router = express.Router();
const User = require('../Models/userModel');

router.get('/all', async(req, res)=> {
    User.find(req.body, {password: 0}).then((value) => {
        res.status(200).json(value.sort((a,b) => a.verified - b.verified));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.get('/', async(req, res)=> {
    User.findById(req.query.user, {password: 0}).then((value) => {
        res.status(200).json(value);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/signup', async (req, res) => {
    User.findOne({email: req.body.email}).then((value) => {
        if (value) throw new Error("User already exists with this email!");
        else new User(req.body).save().then((value) => {
            res.status(200).json(value);
        }).catch((error) => {
            res.status(400).send(error);
        });
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/login', async (req, res) => {
    User.findOne({email: req.body.email}).then((value) => {
        if (value) {
            if (value.password === req.body.password) res.status(200).json(value); 
            else throw new Error("Incorrect password!");
        } else throw new Error("No user found!");
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.patch('/update', async(req, res)=> {
    User.findByIdAndUpdate(req.query.user, req.body, {new: true}).then((value) => {
        res.status(200).json(value);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.delete('/delete', async(req, res)=> {
    User.findByIdAndDelete(req.query.user).then((value) => {
        res.status(200).json(value);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

module.exports = router;