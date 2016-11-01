var mongoose = require('mongoose');

var subjectTypeSchema = mongoose.Schema({
    key:    String,
    SGE:    Number,
    SGEY:   Number,
    SGEO:   Number,
    DE:     Number,
    DEY:    Number,
    DEO:    Number
});

var SubjectTypeModel = mongoose.model('SubjectTypeModel', subjectTypeSchema);

module.exports = SubjectTypeModel;