const mongoose = require('mongoose');
const Course = require('../Extra Schemas/courseSchema');

module.exports = mongoose.model('Degree', mongoose.Schema({
    degreeName: { type: String, required:true },
    courses: { type: Array, of: Course, required: false },
}));