var mongoose = require('mongoose');

var playerDataSchema = mongoose.Schema({
    userID: String,
    gameresults:{
        week1: {
            game1: {
                questionTime: [],
                hint: [],
                correctAnswers: []
            },
            game2: {
                questionTime: [],
                hint: [],
                correctAnswers: []
            },
            game3: {
                questionTime: [],
                hint: [],
                correctAnswers: []
            }
        },
        week2: {
            game1: {
                questionTime: [],
                hint: [],
                correctAnswers: []

            },
            game2: {
                questionTime: [],
                hintTime: [],
                correctAnswers: []
            },
            game3: {
                questionTime: [],
                hint: [],
                correctAnswers: []
            }
        },
        week3: {
            game1: {
                questionTime: [],
                hint: [],
                correctAnswers: []
            },
            game2: {
                questionTime: [],
                hint: [],
                correctAnswers: []
            },
            game3: {
                questionTime: [],
                hint: [],
                correctAnswers: []
            }
        }
    }
});

var PlayerDataModel = mongoose.model('PlayerDataModel', playerDataSchema);

module.exports = PlayerDataModel;