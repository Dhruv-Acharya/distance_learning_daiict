const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
Course_ID:Number,
Faculty_ID:Number,
FacultyCourse_Duration:Number,
FacultyCourse_Description:String,
FacultyCourse_Assignments:String
});

module.exports =  mongoose.model('FacultyCourse', facultyCourseSchema);