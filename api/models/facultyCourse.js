const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
_id: mongoose.Schema.ObjectId,
course_ID: mongoose.Schema.ObjectId,
faculty_ID: mongoose.Schema.ObjectId,
facultyCourse_Duration:Number,
facultyCourse_Description:String,
facultyCourse_Assignments:String
});

module.exports =  mongoose.model('FacultyCourse', facultyCourseSchema);