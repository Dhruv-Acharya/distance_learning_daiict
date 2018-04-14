const mongoose = require('mongoose');

const inquirySchema = mongoose.Schema({
    _id : mongoose.Schema.ObjectId,
    inquiry_title : String,
    inquiry_email : String,
    inquiry_description : String,
    inquiry_response : String,
    inquiry_date_posted : Date,
    inquiry_date_responded : Date
});

module.exports = mongoose.model('Inquiry',inquirySchema);