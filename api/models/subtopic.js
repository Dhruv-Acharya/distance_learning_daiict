const mongoose = require('mongoose');

const subtopicSchema = mongoose.Schema({
    _id : mongoose.Schema.ObjectId,
    subtopic_name : String,
    subtopic_assignment : String,
    subtopic_video : String,
    subtopic_description : String,
    subtopic_assignment_submission : String,
    subtopic_weightage : Number,
    subtopic_assignment_totalMarks : Number,
    subtopic_assignment_acquiredMarks :Number
});

module.exports =  mongoose.model('Subtopic', subtopicSchema);