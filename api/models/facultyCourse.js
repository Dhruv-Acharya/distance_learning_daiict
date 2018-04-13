const mongoose = require('mongoose');
<<<<<<< HEAD
const Subtopic = require('./subtopic');
=======
>>>>>>> 1fb75b107bd7c3380e7e81819170f31364b37b00

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
<<<<<<< HEAD
    facultyCourse_subtopics:[mongoose.Schema.ObjectId]
=======
    facultyCourse_subtopics:[]
>>>>>>> 1fb75b107bd7c3380e7e81819170f31364b37b00
});

module.exports =  mongoose.model('FacultyCourse', facultyCourseSchema);