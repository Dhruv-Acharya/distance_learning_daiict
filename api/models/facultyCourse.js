const mongoose = require('mongoose');
const Subtopic = require('./subtopic');

const facultyCourseSchema = mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    course_id : mongoose.Schema.ObjectId,
    faculty_id : mongoose.Schema.ObjectId,
    facultyCourse_duration : Number,
    facultyCourse_name : String,
    facultyCourse_description : String,
    facultyCourse_image : String,
    facultyCourse_ta_require : Boolean,
    facultyCourse_ta_list : [],
    facultyCourse_prerequisites : String,
    facultyCourse_subtopics:[mongoose.Schema.ObjectId]
});

module.exports =  mongoose.model('FacultyCourse', facultyCourseSchema);