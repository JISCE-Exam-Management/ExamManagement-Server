module.exports = require('mongoose').Schema({
    code: {type: String, required: true},
    name: {type: String, required: true}
}, {_id: false});