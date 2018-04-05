const mongoose = require('mongoose');

const complaintSchema = mongoose.Schema({
    _id : mongoose.Schema.ObjectId,
    complaint_title : String,
    complaint_description : String,
    student_id :  mongoose.Schema.ObjectId,
    FC_id :  mongoose.Schema.ObjectId,
    complaint_response : String
});

module.exports =  mongoose.model('Complaint', complaintSchema);