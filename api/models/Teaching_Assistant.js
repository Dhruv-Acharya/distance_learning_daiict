const mongoose = require('mongoose');

const TASchema = mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    TA_id: Number,
    TA_name: String,
    TA_photo: String,
    TA_email: String,
    TA_password: String,
    TA_contact_number: Number,
    TA_educational_details: String
});

module.exports =  mongoose.model('TA', TASchema);