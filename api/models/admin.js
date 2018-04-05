
const adminSchema = mongoose.Schema({
    admin_ID:Number,
    admin_Email:String,
    admin_Password:String
});

module.exports =  mongoose.model('Admin', adminSchema);