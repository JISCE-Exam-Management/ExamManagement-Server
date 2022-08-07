module.exports = require('mongoose').Schema({
    name: {type: String, required: true},
    updatedBy: {type: String, required: false},
    updatedTime: {type: Number, required: false},
    candidates: {type: Map, of: Boolean, required: false}
});