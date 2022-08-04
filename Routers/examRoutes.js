const express = require('express');
const router = express.Router();
const Exam = require('../Models/examModel');
const Student = require('../Models/studentModel');

router.get('/all', async(req, res) => {
    try {
        res.status(200).json((await Exam.find(req.body)).sort());
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/ongoing', async(req, res) => {
    try {
        const currentTime = Date.now();
        res.status(200).json((await Exam.find({$and: [{startingTime: {$lte: currentTime}}, {endingTime: {$gte: currentTime}}]})).sort());
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/:id', async(req, res) => {
    try {
        res.status(200).json(await Exam.findById(req.params.id));
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/candidates', async(req, res) => {
    try {
        res.status(200).json((await Student.find({ _id: {$in: req.body.candidates}})).sort((a, b) => parseInt(a.univRoll) - parseInt(b.univRoll)));
    } catch (error) {
        res.status(400).send(error);
    } 
});

router.post('/candidates/range', async(req, res) => {
    try {
        res.status(200).json((await Student.find({$and: [{_id: {$in: req.body.candidates}}, {univRoll: {$gte: req.body.startingRoll, $lte: req.body.endingRoll}}]})).sort((a, b) => parseInt(a.univRoll) - parseInt(b.univRoll)));
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/add', async(req, res) => {
    try {
        const exam = new Exam(req.body);
        exam.regularCandidates = new Map();
        (await Student.find({ regularPapers: { $elemMatch: { code: exam.paper.code, name: exam.paper.name }}})).forEach((student)=> {
            exam.regularCandidates.set(student._id, undefined);
        });
        exam.backlogCandidates = new Map();
        (await Student.find({ backlogPapers: { $elemMatch: { code: exam.paper.code, name: exam.paper.name }}})).forEach((student)=> {
            exam.backlogCandidates.set(student._id, undefined);
        });
        exam.updateTime = Date.now().toString();
        res.status(200).json(await exam.save());
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
});

router.post('/students/attendance', async(req, res) => {
    try {
        
    } catch (error) {
        res.status(400).send(error);
    }
});

router.patch('/update/:id', async(req, res) => {
    try {
        const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, {new: true});
        (await Student.find({ regularPapers: { $elemMatch: { code: exam.paper.code, name: exam.paper.name }}})).forEach((student)=> {
            exam.regularCandidates.set(student._id, undefined);
        });
        (await Student.find({ backlogPapers: { $elemMatch: { code: exam.paper.code, name: exam.paper.name }}})).forEach((student)=> {
            exam.backlogCandidates.set(student._id, undefined);
        });
        exam.updateTime = Date.now().toString();
        res.status(200).json(await exam.save());
        console.log(exam);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete('/delete/:id', async(req, res) => {
    try {
        res.status(200).json(await Exam.findByIdAndDelete(req.params.id));
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;