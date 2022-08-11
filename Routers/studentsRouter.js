const express = require('express');
const router = express.Router();
const Student = require('../Models/studentModel');

router.get('/all', async (req, res) => {
    try {
        res.status(200).json((await Student.find(req.body)).sort((a, b) => parseInt(a.univRoll) - parseInt(b.univRoll)));
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/', async (req, res) => {
    try {
        res.status(200).json(await Student.findById(req.query.student));
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/add/single', async (req, res) => {
    try {
        res.status(200).json(await new Student(req.body).save());
    } catch (error) {
        res.send(error);
    }
});

router.post('/add/multiple', async (req, res) => {
    try {
        console.log(req.body);
        await Student.insertMany(req.body.students);
        res.status(200).json(await Student.find());
    } catch (error) {
        res.status(400).send(error);
    }
});

router.patch('/update', async (req, res) => {
    try {
        res.status(200).json(await Student.findByIdAndUpdate(req.query.student, req.body, {new: true}));
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete('/delete', async (req, res) => {
    try {
        res.status(200).send(await Student.findByIdAndDelete(req.query.student));
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;