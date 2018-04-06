const mongoose = require('mongoose');

const TASchema = mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    TA_name: String,
    TA_photo: String,
    TA_email: {
        type: String,
        required:true,
        unique:true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    TA_password: String,
    TA_contact_number: {
        type: Number,
        required:true,
        match: /^[0-9]*$/
    },
    TA_educational_details: String
});

module.exports =  mongoose.model('Teaching_Assistant', TASchema);