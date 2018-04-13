const mongoose = require('mongoose');
const enrollmentSchema =mongoose.Schema({
    _id:mongoose.Schema.ObjectId,
    student_id:mongoose.Schema.ObjectId,
    enrollment_course:[{
        fc_id:mongoose.Schema.ObjectId,
        date:Date
    }]
});
module.exports =  mongoose.model('enrollment', enrollmentSchema);
