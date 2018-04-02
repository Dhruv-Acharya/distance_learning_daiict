const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
    Course_ID:Number,
    Course_Subject:String
});

module.exports =  mongoose.model('Course', courseSchema);