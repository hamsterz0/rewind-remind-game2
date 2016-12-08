var mongoose = require('mongoose');

var subjectTypeSchema = mongoose.Schema({
    key:    String,
    SGE:    Number,
    SGEY:   Number,
    SGEO:   Number,
    DE:     Number,
    DEY:    Number,
    DEO:    Number,
    CG:     Number,
    CGO:    Number,
    CGY:    Number
});

var SubjectTypeModel = mongoose.model('SubjectTypeModel', subjectTypeSchema);

module.exports = SubjectTypeModel;