const express = require('express');
const router = express.Router();
const Student = require('../Models/studentModel');

router.get('/all', async (req, res) => {
    Student.find(req.body).then((value) => {
        res.status(200).json(value.sort((a, b) => parseInt(a.univRoll) - parseInt(b.univRoll)));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.get('/', async (req, res) => {
    Student.findById(req.query.student).then((value) => {
        res.status(200).json(value);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insert', async (req, res) => {
    try {
        await Student.insertMany(req.body.students);
        res.status(200).json(await Student.find());
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/upsert', async (req, res) => {
    const operations = [];
    req.body.students.forEach(s => {
        operations.push({
            updateOne: {
                filter: { _id: s._id },
                update: { $set: s },
                upsert: true
            }
        });
    });
    Student.collection.bulkWrite(operations).then((value) => {
        res.status(200).json(value);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.patch('/update', async (req, res) => {
    Student.findByIdAndUpdate(req.query.student, req.body, { new: true }).then((value) => {
        res.status(200).json(value);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.delete('/delete', async (req, res) => {
    Student.findByIdAndDelete(req.query.student).then((value) => {
        res.status(200).json(value);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

module.exports = router;