const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    course_ID:Number,
    course_Subject:String
});

module.exports =  mongoose.model('Course', courseSchema);