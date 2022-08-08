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

router.get('/', async(req, res) => {
    try {
        res.status(200).json(await Degree.findById(req.query.degree));
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
        res.status(200).json(await Degree.findByIdAndUpdate(req.query.degree, 
            {$push: {courses: {$each: [req.body], $sort: {courseName: 1}}}}, {new: true}));
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/add/stream', async(req, res) => {
    try {
        res.status(200).json(await Degree.findByIdAndUpdate(req.query.degree, 
            {$push: {"courses.$[e1].streams": {$each: [req.body], $sort: {streamName: 1}}}}, 
            {arrayFilters:[{"e1._id": req.query.course}], new: true}));
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/add/regulation', async(req, res) => {
    try {
        res.status(200).json(await Degree.findByIdAndUpdate(req.query.degree, 
        {$push: {"courses.$[e1].streams.$[e2].regulations": {$each: [req.body], $sort: {regulationName: 1}}}}, 
        {arrayFilters: [{"e1._id": req.query.course}, {"e2._id": req.query.stream}], new: true}));
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
});

router.post('/add/semester', async(req, res) => {
    try {
        res.status(200).json(await Degree.findByIdAndUpdate(req.query.degree, 
        {$push: {"courses.$[e1].streams.$[e2].regulations.$[e3].semesters": {$each: [req.body], $sort: {semesterName: 1}}}}, 
        {arrayFilters: [{"e1._id": req.query.course}, {"e2._id": req.query.stream}, {"e3._id": req.query.regulation}], new: true}));
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
});

router.post('/add/paper', async(req, res) => {
    try {
        res.status(200).json(await Degree.findByIdAndUpdate(req.query.degree, 
        {$push: {"courses.$[e1].streams.$[e2].regulations.$[e3].semesters.$[e4].papers": {$each: [req.body], $sort: {code: 1}}}}, 
        {arrayFilters: [{"e1._id": req.query.course}, {"e2._id": req.query.stream}, {"e3._id": req.query.regulation}, {"e4._id": req.query.semester}], new: true}));
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
});

router.patch('/update', async(req, res) => {
    try {
        res.status(200).json(await Degree.findByIdAndUpdate(req.query.degree, req.body, {new: true}));
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete('/delete', async(req, res) => {
    try {
        res.status(200).json(await Degree.findByIdAndDelete(req.query.degree))
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;