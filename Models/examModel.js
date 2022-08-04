const mongoose = require('mongoose');
const Paper = require('../Extra Schemas/paperSchema');

module.exports = mongoose.model('Exam', mongoose.Schema({
    name: {type: String, required: true},
    paper: {type: Paper, required: true},
    degree: {type: String, required: true},
    course: {type: String, required: true},
    stream: {type: String, required: true},
    regulation: {type: String, required: true},
    semester: {type: String, required: true},
    startingTime: {type: Number, required: true},
    endingTime: {type: Number, required: true},
    updatedBy: {type: String, required: true},
    updateTime: {type: String, required: true},
    regularCandidates: {type: Map, of: Boolean, required: false},
    backlogCandidates: {type: Map, of: Boolean, required: false}
}));