var mongoose = require('mongoose');

var authSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    stype: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    current: {
        type: Number,
        default: 11
    },
    completionEmail: {
        type: Boolean,
        default: false
    },
    practiceComplete: {
        type: Boolean,
        default: false
    }
});

var AuthModel = mongoose.model('AuthModel', authSchema);
module.exports = AuthModel;