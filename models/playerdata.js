var mongoose = require('mongoose');

var playerDataSchema = mongoose.Schema({
    userID: String,
    week1: {
        game1: {
            time: [],
            hintTime: [],
            correctAnswers: []
        },
        game2: {
            time: [],
            hintTime: [],
            correctAnswers: []
        },
        game3: {
            time: [],
            hintTime: [],
            correctAnswers: []
        }
    },
    week2: {
        game1: {
            time: [],
            hintTime: [],
            correctAnswers: []

        },
        game2: {
            time: [],
            hintTime: [],
            correctAnswers: []
        },
        game3: {
            time: [],
            hintTime: [],
            correctAnswers: []
        }
    },
    week3: {
        game1: {
            time: [],
            hintTime: [],
            correctAnswers: []
        },
        game2: {
            time: [],
            hintTime: [],
            correctAnswers: []
        },
        game3: {
            time: [],
            hintTime: [],
            correctAnswers: []
        }
    }
});

var PlayerDataModel = mongoose.model('PlayerDataModel', playerDataSchema);

module.exports = PlayerDataModel;