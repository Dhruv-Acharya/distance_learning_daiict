const mongoose = require('mongoose');
const subtopic = require('subtopic');

const studentSubtopicSchema = mongoose.Schema({
    _id : mongoose.Schema.ObjectId,
    FC_id : mongoose.Schema.ObjectId,
    subtopic_id : mongoose.Schema.ObjectId,
    student_id : mongoose.Schema.ObjectId,
    subtopic_assignment_submission : String,
    subtopic_assignment_acquiredMarks :Number,
    subtopic_assignment_submission_date : Date,
    subtopic_completion : Boolean
});

module.exports =  mongoose.model('studentSubtopic', studentSubtopicSchema);