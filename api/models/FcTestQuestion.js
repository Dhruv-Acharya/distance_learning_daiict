const mongoose = require('mongoose');

const FcTestQuestionSchema = mongoose.Schema({
    _id : mongoose.Schema.ObjectId,
    FcTestQuestion_text : String,
    FcTestQuestion_answers : [String],
    FcTestQuestion_answer : String
});

module.exports =  mongoose.model('FcTestQuestion', FcTestQuestionSchema);