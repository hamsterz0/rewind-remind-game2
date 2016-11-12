var mongoose = require('mongoose');

var playerDataSchema = mongoose.Schema({
    userID: Number,
    week1: {
        game1: {
            time: [],
            hintTime: []
        },
        game2: {
            time: [],
            hintTime: []
        },
        game3: {
            time: [],
            hintTime: []
        }
    },
    week2: {
        game1: {
            time: [],
            hintTime: []

        },
        game2: {
            time: [],
            hintTime: []
        },
        game3: {
            time: [],
            hintTime: []
        }
    },
    week3: {
        game1: {
            time: [],
            hintTime: []
        },
        game2: {
            time: [],
            hintTime: []
        },
        game3: {
            time: [],
            hintTime: []
        }
    }
});

var PlayerDataModel = mongoose.model('PlayerDataModel', playerDataSchema);

module.exports = PlayerDataModel;