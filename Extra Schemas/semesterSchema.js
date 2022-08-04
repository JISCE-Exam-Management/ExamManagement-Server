const Paper = require('./paperSchema');

module.exports = require('mongoose').Schema({
    semesterName: {type: String, required: true},
    papers: {type: Array, of: Paper, required: false}
});