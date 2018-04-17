const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
    _id : mongoose.Schema.ObjectId,
    admin_email : String,
    admin_password : String,
    admin_resetPasswordToken : String,
    admin_resetPasswordExpires : String
});

module.exports =  mongoose.model('Admin', adminSchema);