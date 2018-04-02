const mongoose = require('mongoose');

const facultyCourseSchema = mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    FC_id : Number,
    course_id : Number,
    faculty_id : Number,
    facultyCourse_duration:Number,
    facultyCourse_description:String,
    facultyCourse_subtopics:[Number]
});

module.exports =  mongoose.model('FacultyCourse', facultyCourseSchema);