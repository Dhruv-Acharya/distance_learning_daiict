const mongoose = require('mongoose');

const studentSchema = mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    student_name: String,
    student_photo: String,
    student_email: {
        type: String,
        required:true,
        unique:true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    student_password: String,
    student_contact_number: {
        type: Number,
        required:true,
        match: /^[0-9]*$/
    },
    student_educational_details: String,
    student_occupation: String,
    student_industry: String,
    student_collage_name: String,
    student_experience_level: String,
    student_gender: String,
    student_birthdate:String,
    student_address:String,
    student_topSkills: String,
    student_resetPasswordExpires:Date,
    student_resetPasswordToken:String

});

module.exports =  mongoose.model('Student', studentSchema);
