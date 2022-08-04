const mongoose = require('mongoose');

module.exports = mongoose.model('Admin', mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
}));