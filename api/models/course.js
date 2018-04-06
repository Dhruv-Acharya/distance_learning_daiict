const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    course_subject : {
        type: String,
        required:true,
    }
});

module.exports =  mongoose.model('Course', courseSchema);