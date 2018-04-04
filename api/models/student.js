var mongoose = require("mongoose");
var studentSchema= new mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    student_name : String,
    student_photo : String,
    student_occupation : String,
    student_industry : String,
    student_collegeName : String,
    student_experience : String,
    student_education_level : String,
    student_email : String,
    student_password : String,
    student_contact_number : String,
    student_country : String,
    student_birthdate : Date,
    student_address : String,
    student_skills : [String]
});
module.exports=mongoose.model('Student', studentSchema);