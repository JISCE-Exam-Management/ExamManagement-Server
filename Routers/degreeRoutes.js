const express = require('express');
const router = express.Router();
const Degree = require('../Models/degreeModel');

router.get('/all', async(req, res) => {
    try {
        res.status(200).json((await Degree.find()).sort((a,b)=> a.degreeName.localeCompare(b.degreeName)));
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/:id', async(req, res) => {
    try {
        res.status(200).json(await Degree.findById(req.params.id));
        await Degree.find()
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/add/degree', async(req, res) => {
    try {
        res.status(200).json(await new Degree(req.body).save());
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/add/course', async(req, res) => {
    try {
        res.status(200).json(await Degree.findByIdAndUpdate(req.body.degree, 
            {$push: {courses: {$each: [JSON.parse(req.body.course)], $sort: {courseName: 1}}}}, {new: true}));
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/add/stream', async(req, res) => {
    try {
        res.status(200).json(await Degree.findByIdAndUpdate(req.body.degree, 
            {$push: {"courses.$[e1].streams": {$each: [JSON.parse(req.body.stream)], $sort: {streamName: 1}}}}, 
            {arrayFilters:[{"e1._id": req.body.course}], new: true}));
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/add/regulation', async(req, res) => {
    try {
        res.status(200).json(await Degree.findByIdAndUpdate(req.body.degree, 
        {$push: {"courses.$[e1].streams.$[e2].regulations": {$each: [JSON.parse(req.body.regulation)], $sort: {regulationName: 1}}}}, 
        {arrayFilters: [{"e1._id": req.body.course}, {"e2._id": req.body.stream}], new: true}));
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
});

router.post('/add/semester', async(req, res) => {
    try {
        res.status(200).json(await Degree.findByIdAndUpdate(req.body.degree, 
        {$push: {"courses.$[e1].streams.$[e2].regulations.$[e3].semesters": {$each: [JSON.parse(req.body.semester)], $sort: {semesterName: 1}}}}, 
        {arrayFilters: [{"e1._id": req.body.course}, {"e2._id": req.body.stream}, {"e3._id": req.body.regulation}], new: true}));
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
});

router.post('/add/paper', async(req, res) => {
    try {
        res.status(200).json(await Degree.findByIdAndUpdate(req.body.degree, 
        {$push: {"courses.$[e1].streams.$[e2].regulations.$[e3].semesters.$[e4].papers": {$each: [JSON.parse(req.body.paper)], $sort: {code: 1}}}}, 
        {arrayFilters: [{"e1._id": req.body.course}, {"e2._id": req.body.stream}, {"e3._id": req.body.regulation}, {"e4._id": req.body.semester}], new: true}));
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
});

router.patch('/update/:id', async(req, res) => {
    try {
        res.status(200).json(await Degree.findByIdAndUpdate(req.params.id, req.body, {new: true}));
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete('/delete/:id', async(req, res) => {
    try {
        res.status(200).json(await Degree.findByIdAndDelete(req.params.id))
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;