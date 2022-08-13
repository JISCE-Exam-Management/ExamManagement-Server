const express = require('express')
const router = express.Router()
const Admin = require('../Models/adminModel')

router.post('/signup', async (req, res) => {
    try {
        const user = await Admin.findOne({email: req.body.email});
        if (user) throw new Error("User already exists with this email!");
        else res.status(200).json(await new Admin(req.body).save());
    } catch (err) {
        res.status(400).json(err);
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await Admin.findOne({email: req.body.email});
        if (user) {
            if (user.password === req.body.password) {
                res.status(200).json(user);
            } else throw new Error("Incorrect password!");
        } else throw new Error("No user found!");
    } catch (err) {
        res.status(400).json(err);
    }
});

module.exports = router;