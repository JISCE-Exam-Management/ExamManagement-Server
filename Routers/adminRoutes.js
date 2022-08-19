const express = require('express')
const router = express.Router()
const Admin = require('../Models/adminModel')

router.post('/signup', (req, res) => {
    Admin.findOne({email: req.body.email}).then((user) => {
        if (user) throw new Error("User already exists with this email!");
        else new Admin(req.body).save().then((value) => {
            res.status(200).json(value);
        }).catch((error) => {
            res.status(400).send(error);
        });
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/login', (req, res) => {
    Admin.findOne({email: req.body.email}).then((user) => {
        if (user) {
            if (user.password === req.body.password) {
                res.status(200).json(user);
            } else throw new Error("Incorrect password!");
        } else throw new Error("No user found!");
    }).catch((error) => {
        res.status(400).send(error);
    });
});

module.exports = router;