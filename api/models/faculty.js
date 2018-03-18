const mongoose = require('mongoose');

const facultySchema = mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    faculty_id: Number,
    faculty_name: String,
    faculty_photo: String,
    faculty_email: String,
    faculty_password: String,
    faculty_contact_number: Number,
    faculty_educational_details: String,
    faculty_area_interest: String
});

module.exports =  mongoose.model('Faculty', facultySchema);