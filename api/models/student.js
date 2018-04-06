<<<<<<< HEAD
const mongoose = require('mongoose');

const studentSchema = mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    Student_id: Number,
    Student_name: String,
    Student_photo: String,
    Student_email: {
        type: String,
        required:true,
        unique:true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    Student_password: String,
    Student_contact_number: Number,
    Student_educational_details: String,
    Student_occupation: String,
    Student_Industry: String,
    Student_collage_name: String,
    Student_experience_level: String,
    Student_gender: String,
    Student_birthdate:String,
    Student_Address:String,
    Student_topSkills: String
});

module.exports =  mongoose.model('Student', studentSchema);
=======
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
>>>>>>> 6f07ac0122ad33c052c5ab539b2fa332dd7147f1
