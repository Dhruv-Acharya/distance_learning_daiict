const mongoose = require('mongoose');

const complaintSchema = mongoose.Schema({
    _id : mongoose.Schema.ObjectId,
    complaint_title : String,
    complaint_description : String,
    student_id : Number,
    FC_id : Number,
    complaint_response : String
});

module.exports =  mongoose.model('Complaint', complaintSchema);