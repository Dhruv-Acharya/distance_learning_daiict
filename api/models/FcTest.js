const mongoose = require('mongoose');

const FcTestSchema = mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    FC_id : mongoose.Schema.ObjectId,
    FcTest_questions : []
});

module.exports =  mongoose.model('FcTest', FcTestSchema);