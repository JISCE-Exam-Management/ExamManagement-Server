const mongoose = require('mongoose');
const Paper = require('../Extra Schemas/paperSchema');

module.exports = mongoose.model('Student', mongoose.Schema({
    _id: {type: String, required: true},
    name: {type: String, required: true},
    email: {type: String, required: false},
    phone: {type: String, required: false},
    collegeId: {type: String, required: true},
    univRoll: {type: Number, required: true},
    univReg: {type: Number, required: true},
    admissionYear: {type: Number, required: true},
    isLateral: {type: Boolean, required: true, default: false},
    degree: {type: String, required: true},
    course: {type: String, required: true},
    stream: {type: String, required: true},
    regulation: {type: String, required: true},
    semester: {type: String, required: true},
    regularPapers: {type: Array, of: Paper, required: true},
    backlogPapers: {type: Array, of: Paper, required: false}
}));