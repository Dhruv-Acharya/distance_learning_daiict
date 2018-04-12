const mongoose = require('mongoose');
const FcTestQuestion = require('./FcTestQuestion');

const FcTestSchema = mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    FC_id : mongoose.Schema.ObjectId,
    FcTest_questions : [FcTestQuestion]
});

module.exports =  mongoose.model('FcTest', FcTestSchema);