const mongoose = require('mongoose');

const inquirySchema = mongoose.Schema({
    _id : mongoose.Schema.ObjectId,
    inquiry_title : String,
    inquiry_email :{
        type: String,
        required:true,
        unique:true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    inquiry_response : String
});

module.exports = mongoose.model('Inquiry',inquirySchema);