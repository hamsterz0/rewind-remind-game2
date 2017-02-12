var mongoose = require('mongoose');

var playerDataSchema = mongoose.Schema({
    userID: String,
    gameresults:{
        week1: {
            game1: {
                questionTime: [],
                hint: [],
                correctAnswers: [],
                phrases: []
            },
            game2: {
                questionTime: [],
                hint: [],
                correctAnswers: [],
                phrases: []
            },
            game3: {
                questionTime: [],
                hint: [],
                correctAnswers: [],
                phrases: []
            }
        },
        week2: {
            game1: {
                questionTime: [],
                hint: [],
                correctAnswers: [],
                phrases: []

            },
            game2: {
                questionTime: [],
                hint: [],
                correctAnswers: [],
                phrases: []
            },
            game3: {
                questionTime: [],
                hint: [],
                correctAnswers: [],
                phrases: []
            }
        },
        week3: {
            game1: {
                questionTime: [],
                hint: [],
                correctAnswers: [],
                phrases: []
            },
            game2: {
                questionTime: [],
                hint: [],
                correctAnswers: [],
                phrases: []
            },
            game3: {
                questionTime: [],
                hint: [],
                correctAnswers: [],
                phrases: []
            }
        }
    }
});

var PlayerDataModel = mongoose.model('PlayerDataModel', playerDataSchema);

module.exports = PlayerDataModel;