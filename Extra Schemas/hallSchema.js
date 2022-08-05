module.exports = require('mongoose').Schema({
    name: {type: String, required: true},
    candidates: {type: Map, of: Boolean, required: false}
}, {_id: false});