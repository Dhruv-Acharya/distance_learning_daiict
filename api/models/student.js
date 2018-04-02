var mongoose = require("mongoose");
var studentSchema= new mongoose.Schema({
    Student_Name:String,
    Student_Photo:String,
    Student_Occupation:String,
    Student_Industry:String,
    Student_CollegeName:String,
    Student_Experience:String,
    Student_Education_Level:String,
    Student_Email:String,
    Student_Password:String,
    Student_MobileNo:String,
    Student_Country:String,
    Student_BirthDate:Date,
    Student_Address:String,
    Student_TopSkills:Array 
});
module.exports=mongoose.model('Student', studentSchema);