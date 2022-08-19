const express = require('express');
const router = express.Router();
const Student = require('../Models/studentModel');

router.get('/all', (req, res) => {
    Student.find(req.body).then((value) => {
        res.status(200).json(value.sort((a, b) => parseInt(a.univRoll) - parseInt(b.univRoll)));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.get('/', (req, res) => {
    Student.findById(req.query.student).then((value) => {
        res.status(200).json(value);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insert', (req, res) => {
    Student.insertMany(req.body.students).then((value) => {
        res.status(200).json(value);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/upsert', (req, res) => {
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
        console.log(value);
        res.status(200).json(value);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/in', (req, res) => {
    Student.find({_id: {$in: req.body.students}}).then((value) => {
        res.status(200).json(value.sort((a, b)=> parseInt(a.univRoll) - parseInt(b.univRoll)));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.patch('/update', (req, res) => {
    Student.findByIdAndUpdate(req.query.student, req.body, { new: true }).then((value) => {
        res.status(200).json(value);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.delete('/delete', (req, res) => {
    Student.findByIdAndDelete(req.query.student).then((value) => {
        res.status(200).json(value);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

module.exports = router;