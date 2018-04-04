const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    course_subject : String
});

module.exports =  mongoose.model('Course', courseSchema);