const mongoose = require('mongoose');

const inquirySchema = mongoose.Schema({
    _id : mongoose.Schema.ObjectId,
    inquiry_id : Number,
    inquiry_title : String,
    inquiry_email : String,
    inquiry_response : String
});

module.exports = mongoose.model('Inquiry',inquirySchema);