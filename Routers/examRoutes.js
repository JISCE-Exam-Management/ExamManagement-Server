const express = require('express');
const router = express.Router();
const Exam = require('../Models/examModel');
const Student = require('../Models/studentModel');

router.get('/all', (req, res) => {
    Exam.find(req.body).then((value) => {
        res.status(200).json(value.sort((a, b) => b.examStartingTime - a.examStartingTime));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.get('/ongoing', (req, res) => {
    const currentTime = Date.now();
    Exam.find({$and: [{examStartingTime: {$lte: currentTime}}, {examEndingTime: {$gte: currentTime}}]}).then((value) => {
        res.status(200).json(value.sort((a, b) => b.examStartingTime - a.examStartingTime));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.get('/upcoming', (req, res) => {
    const currentTime = Date.now();
    Exam.find({examStartingTime: {$gt: currentTime}}).then((value) => {
        res.status(200).json(value.sort((a, b) => b.examStartingTime - a.examStartingTime));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.get('/completed', (req, res) => {
    const currentTime = Date.now();
    Exam.find({examEndingTime: {$lt: currentTime}}).then((value) => {
        res.status(200).json(value.sort((a, b) => b.examStartingTime - a.examStartingTime));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.get('/candidates', (req, res) => {
    Exam.findById(req.query.exam).then((exam) => {
        const studentIds = [];
        exam.halls.forEach((hall) => studentIds.push(...hall.candidates.keys()));
        Student.find({$and: [{_id: {$nin: studentIds}}, {$or: [{regularPapers: {$elemMatch: exam.paper}}, {backlogPapers: {$elemMatch: exam.paper}}]}]}).then((value) => {
            res.status(200).json(value.sort((a, b) => parseInt(a.univRoll) - parseInt(b.univRoll)));
        }).catch((error) => {
            res.status(400).send(error);
        });
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.get('/', (req, res) => {
    Exam.findById(req.query.exam).then((value) => {
        res.status(200).json(value);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insert', (req, res) => {
    Exam.insertMany(req.body.exams).then((value) => {
        res.status(200).json(value);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/upsert', (req, res) => {
    const operations = [];
    req.body.exams.forEach(e => {
        operations.push({
            updateOne: {
                filter: {name: e.name},
                update: {$set: e},
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

router.post('/hall/add', (req, res) => {
    Exam.findByIdAndUpdate(req.query.exam, {
        $push: {
            halls: {
                $each: [req.body],
                $sort: {name: 1}
            }
        }
    }, {new: true}).then((value) => {
        res.status(200).json(value);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.patch('/hall/update', (req, res) => {
    Exam.findByIdAndUpdate(req.query.exam, {$set: {"halls.$[e1]": req.body}}, {
        arrayFilters: [{"e1._id": req.body._id}],
        new: true
    }).then((value) => {
        res.status(200).json(value);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.patch('/update', (req, res) => {
    Exam.findByIdAndUpdate(req.query.exam, req.body, {new: true}).then((value) => {
        res.status(200).json(value);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.delete('/hall/delete', (req, res) => {
    Exam.findByIdAndUpdate(req.query.exam, {$pull: {halls: {_id: req.query.hall}}}, {new: true}).then((value) => {
        res.status(200).json(value);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.delete('/delete', (req, res) => {
    Exam.findByIdAndDelete(req.query.exam).then((value) => {
        res.status(200).json(value);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

module.exports = router;