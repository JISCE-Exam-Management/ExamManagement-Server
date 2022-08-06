const express = require('express');
const router = express.Router();
const Exam = require('../Models/examModel');
const Student = require('../Models/studentModel');

router.get('/all', async(req, res) => {
    try {
        res.status(200).json((await Exam.find(req.body)).sort((a,b)=> a.startingTime - b.startingTime));
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/ongoing', async(req, res) => {
    try {
        const currentTime = Date.now();
        res.status(200).json((await Exam.find({$and: [{examStartingTime: {$lte: currentTime}}, {examEndingTime: {$gte: currentTime}}]})).sort((a,b)=> a.startingTime - b.startingTime));
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/', async(req, res) => {
    try {
        res.status(200).json(await Exam.findById(req.query.exam));
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/candidates', async(req, res) => {
    try {
        res.status(200).json(await Student.find({$or: [{ regularPapers: { $elemMatch: req.body.paper}}, { backlogPapers: { $elemMatch: req.body.paper}}]}));
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/hall/candidates', async(req, res) => {
    try {
        res.status(200).json(await Student.find({_id: {$in: req.body.candidates}}));
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/add/single', async(req, res) => {
    try {
        res.status(200).json(await new Exam(req.body).save());
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/add/multiple', async (req, res) => {
    try {
        await Exam.insertMany(req.body.exams);
        res.status(200).json(await Exam.find().sort((a,b)=> a.startingTime - b.startingTime));
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/add/hall', async (req, res) => {
    try {
        res.status(200).json(await Exam.findByIdAndUpdate(req.query.exam, {$push: {halls: {$each: [req.body], $sort: {name: 1}}}}, {new: true}));
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/attendance', async(req, res) => {
    try {
        
    } catch (error) {
        res.status(400).send(error);
    }
});

router.patch('/update/hall', async(req, res) => {
    try {
        res.status(200).json(await Exam.findByIdAndUpdate(req.query.exam, {$addToSet: {"halls.$[e1]": req.body}}, {arrayFilters:[{"e1._id": req.body._id}], new: true}));
    } catch (error) {
        res.status(400).send(error);
    }
});

router.patch('/update', async(req, res) => {
    try {
        res.status(200).json(await Exam.findByIdAndUpdate(req.query.exam, req.body, {new: true}));
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete('/delete/hall', async(req, res) => {
    try {
        res.status(200).json(await Exam.findByIdAndUpdate(req.query.exam, {$pull: {halls: {_id: req.body._id}}}, {new: true}));
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete('/delete', async(req, res) => {
    try {
        res.status(200).json(await Exam.findByIdAndDelete(req.query.exam));
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;