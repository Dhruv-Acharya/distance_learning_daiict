var mongoose = require("mongoose");
var studentSchema= new mongoose.Schema({
    student_name:String,
    student_photo:String,
    student_occupation:String,
    student_industry:String,
    student_collegeName:String,
    student_experienceLevel:String,
    student_educationLevel:String,
    student_email:String,
    student_password:String,
    student_mobileNo:String,
    student_country:String,
    student_birthDate:Date,
    student_address:String,
    student_topSkills:Array 
});
modules.export.student=mongoose.Schema('student', studentSchema);