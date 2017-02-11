var mongoose = require('mongoose');

var wordsSchema = mongoose.Schema({

    memorizewords: {

        practiceRound: [],
        w1: {
            g1: [],
            g2: [],
            g3: [],
        },
        w2: {
            g1: [],
            g2: [],
            g3: [],
        },
        w3: {
            g1: [],
            g2: [],
            g3: [],
        }
    },

    testwords: {
        
        practiceRound: [],
        w1: {
            g1: [],
            g2: [],
            g3: [],
        },
        w2: {
            g1: [],
            g2: [],
            g3: [],
        },
        w3: {
            g1: [],
            g2: [],
            g3: [],
        }
    }
});

var WordsModel = mongoose.model('WordsModel', wordsSchema);
module.exports = WordsModel;