const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();
const Exam = require('../Models/examModel');
const Student = require('../Models/studentModel');

router.get('/all', async(req, res) => {
    Exam.find(req.body).then((value) => {
        res.status(200).json(value.sort((a,b)=> a.startingTime - b.startingTime));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.get('/ongoing', async(req, res) => {
    Exam.find({$and: [{examStartingTime: {$lte: currentTime}}, {examEndingTime: {$gte: currentTime}}]}).then((value) => {
        res.status(200).json(value.sort((a,b)=> a.startingTime - b.startingTime));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.get('/upcoming', async(req, res) => {
    Exam.find({examStartingTime: {$gt: currentTime}}).then((value) => {
        res.status(200).json(value.sort((a,b)=> a.startingTime - b.startingTime));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.get('/completed', async(req, res) => {
    Exam.find({examEndingTime: {$lt: currentTime}}).then((value) => {
        res.status(200).json(value.sort((a,b)=> a.startingTime - b.startingTime));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.get('/', async(req, res) => {
    Exam.findById(req.query.exam).then((value) => {
        res.status(200).json(value);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/candidates', async(req, res) => {
    Exam.findById(req.query.exam).then((exam) => {
        const studentIds = [];
        exam.halls.forEach((hall)=> studentIds.push(...hall.candidates.keys()));
        Student.find({$and: [{_id: {$nin: studentIds}}, {$or: [{ regularPapers: { $elemMatch: exam.paper}}, { backlogPapers: { $elemMatch: exam.paper}}]}]}).then((value) => {
            res.status(200).json(value.sort((a, b) => parseInt(a.univRoll) - parseInt(b.univRoll)));
        }).catch((error) => {
            res.status(400).send(error);
        });
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/hall/candidates', async(req, res) => {
    Student.find({_id: {$in: req.body.candidates}}).then((value) => {
        res.status(200).json(value.sort((a, b)=> parseInt(a.univRoll) - parseInt(b.univRoll)));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insert', async (req, res) => {
    Exam.insertMany(req.body.exams).then((value)=> {
        res.status(200).json(value);
    }).catch((error)=> {
        res.status(400).send(error);
    });
});

router.post('/upsert', async (req, res) => {
    const operations = [];
    req.body.exams.forEach(e => {
        operations.push({
            updateOne: {
                filter: { name: e.name },
                update: { $set: e },
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

router.post('/add/hall', async (req, res) => {
    Exam.findByIdAndUpdate(req.query.exam, {$push: {halls: {$each: [req.body], $sort: {name: 1}}}}, {new: true}).then((value) => {
        res.status(200).json(value);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.patch('/update/hall', async(req, res) => {
    Exam.findByIdAndUpdate(req.query.exam, {$set: {"halls.$[e1]": req.body}}, {arrayFilters:[{"e1._id": req.body._id}], new: true}).then((value) => {
        res.status(200).json(value);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.patch('/update', async(req, res) => {
    Exam.findByIdAndUpdate(req.query.exam, req.body, {new: true}).then((value) => {
        res.status(200).json(value);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.delete('/delete/hall', async(req, res) => {
    Exam.findByIdAndUpdate(req.query.exam, {$pull: {halls: {_id: req.query.hall}}}, {new: true}).then((value) => {
        res.status(200).json(value);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.delete('/delete', async(req, res) => {
    Exam.findByIdAndDelete(req.query.exam).then((value) => {
        res.status(200).json(value);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

module.exports = router;