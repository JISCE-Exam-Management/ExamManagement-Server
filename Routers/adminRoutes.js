const express = require('express')
const router = express.Router()
const Admin = require('../Models/adminModel')

router.get('/all', (req, res)=> {
    Admin.find(req.body, {password: 0}).then((value) => {
        res.status(200).json(value.sort((a,b) => a.verified - b.verified));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.get('/', (req, res)=> {
    Admin.findById(req.query.admin, {password: 0}).then((value) => {
        res.status(200).json(value);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/signup', (req, res) => {
    Admin.findOne({email: req.body.email}).then((admin) => {
        if (admin) throw new Error("Admin already exists with this email!");
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
    Admin.findOne({email: req.body.email}).then((admin) => {
        if (admin) {
            if (admin.password === req.body.password) {
                res.status(200).json(admin);
            } else throw new Error("Incorrect password!");
        } else throw new Error("No admin found!");
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.patch('/update', (req, res)=> {
    Admin.findByIdAndUpdate(req.query.admin, req.body, {new: true}).then((value) => {
        res.status(200).json(value);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.delete('/delete', (req, res)=> {
    Admin.findByIdAndDelete(req.query.admin).then((value) => {
        res.status(200).json(value);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

module.exports = router;