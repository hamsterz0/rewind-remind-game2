var mongoose = require('mongoose');

var subjectTypeSchema = mongoose.Schema({
    SGE: Number,
    DE: Number
});

var SubjectTypeModel = mongoose.model('SubjectTypeModel', subjectTypeSchema);

module.exports = SubjectTypeModel;