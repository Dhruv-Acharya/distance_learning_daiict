const mongoose = require('mongoose');

const inquirySchema = mongoose.Schema({
    _id : mongoose.Schema.ObjectId,
    feedback_title : String,
    feedback_description : String,
    FC_id : mongoose.Schema.ObjectId,
    feedback_date_posted : Date,
});

module.exports = mongoose.model('Feedback',feedbackSchema);