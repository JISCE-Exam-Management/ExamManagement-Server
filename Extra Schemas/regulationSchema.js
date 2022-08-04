const Semester = require('./semesterSchema');

module.exports = require('mongoose').Schema({
    regulationName: {type: String, required: true},
    semesters: {type: Array, of: Semester, required: false}
});