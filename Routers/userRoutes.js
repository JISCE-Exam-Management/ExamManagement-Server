const express = require('express');
const router = express.Router();
const User = require('../Models/userModel');

router.get('/all', (req, res)=> {
    User.find(req.body, {password: 0}).then((value) => {
        res.status(200).json(value.sort((a,b) => a.verified - b.verified));
    }).catch((error) => {
        res.status(400).send(error.message);
    });
});

router.get('/', (req, res)=> {
    User.findById(req.query.user, {password: 0}).then((value) => {
        res.status(200).json(value);
    }).catch((error) => {
        res.status(400).send(error.message);
    });
});

router.post('/signup', (req, res) => {
    User.findOne({email: req.body.email}).then((value) => {
        if (value) throw new Error("User already exists with this email!");
        else new User(req.body).save().then((value) => {
            res.status(200).json(value);
        }).catch((error) => {
            res.status(400).send(error.message);
        });
    }).catch((error) => {
        res.status(400).send(error.message);
    });
});

router.post('/login', (req, res) => {
    User.findOne({email: req.body.email}).then((value) => {
        if (value) {
            if (value.password === req.body.password) res.status(200).json(value); 
            else throw new Error("Incorrect password!");
        } else throw new Error("No user found!");
    }).catch((error) => {
        res.status(400).send(error.message);
    });
});

router.patch('/update', (req, res)=> {
    User.findByIdAndUpdate(req.query.user, req.body, {new: true}).then((value) => {
        res.status(200).json(value);
    }).catch((error) => {
        res.status(400).send(error.message);
    });
});

router.delete('/delete', (req, res)=> {
    User.findByIdAndDelete(req.query.user).then((value) => {
        res.status(200).json(value);
    }).catch((error) => {
        res.status(400).send(error.message);
    });
});

module.exports = router;