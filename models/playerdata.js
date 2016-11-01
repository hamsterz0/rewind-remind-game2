var mongoose = require('mongoose');

var playerDataSchema = mongoose.Schema({
    week1: {
        game1: {
            type: String
        },
        game2: {
            type: String
        },
        game3: {
            type: String
        }
    },
    week2: {
        game1: {
            type: String

        },
        game2: {
            type: String
        },
        game3: {
            type: String
        }
    },
    week3: {
        game1: {
            type: String
        },
        game2: {
            type: String
        },
        game3: {
            type: String
        }
    }
});

var PlayerDataModel = mongoose.model('PlayerDataModel', playerDataSchema);

module.exports = PlayerDataModel;