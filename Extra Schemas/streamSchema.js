const Regulation = require('./regulationSchema');

module.exports = require('mongoose').Schema({
    streamName: {type: String, required: true},
    regulations: {type: Array, of: Regulation, required: false}
});
