const mongoose = require('mongoose');
const Paper = require('../Extra Schemas/paperSchema');
const Hall = require('../Extra Schemas/hallSchema');

module.exports = mongoose.model('Exam', mongoose.Schema({
    name: {type: String, required: true},
    paper: {type: Paper, required: true},
    degree: {type: String, required: true},
    course: {type: String, required: true},
    stream: {type: String, required: true},
    regulation: {type: String, required: true},
    semester: {type: String, required: true},
    examStartingTime: {type: Number, required: true},
    examEndingTime: {type: Number, required: true},
    attendanceStartingTime: {type: Number, required: true},
    attendanceEndingTime: {type: Number, required: true},
    halls: {type: Array, of: Hall, require: false}
}));