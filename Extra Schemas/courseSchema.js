const Stream = require('./streamSchema');

module.exports = require('mongoose').Schema({
    courseName: {type: String, required: true},
    streams: {type: Array, of: Stream, required: false}
});