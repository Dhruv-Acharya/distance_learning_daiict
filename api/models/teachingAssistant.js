const mongoose = require('mongoose');

const TASchema = mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    ta_name: String,
    ta_photo: String,
    ta_email: {
        type: String,
        unique:true,
        required:true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    ta_password: String,
    ta_contact_number: {
        type: Number,
        required:true,
        match: /^[0-9]*$/
    },
    ta_educational_details: String,
    ta_resetPasswordToken:String,
    ta_resetPasswordExpires:Date

});

module.exports =  mongoose.model('Teaching_Assistant', TASchema);