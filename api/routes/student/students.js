var express=require("express");
var app = express();
var Student = require("../../models/student");
var bodyParser=require('body-parser');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
// routes for /student
//get on /login
app.post('/login',function(req,res,next){

});

router.post('/signup',(req, res, next) =>{
    Student.find({Student_Email:req.body.Student_Email})
        .exec()
        .then(data => {
            if(data.length>=1){
                res.status(409).json({
                    message: 'Email already exists, try different email'
                });
            }else{
                
                bcrypt.hash(req.body.Student_Password,10,(err,hashed_pass)=> {
                    if(err) {
                        return res.status(500).json({
                            error:err
                        });
                    }else{
                        const student= new Student({
                            
                            Student_Name:req.body.Student_Name,
                            Student_Photo:req.body.Student_Photo,
                            Student_Occupation:req.body.Student_Occupation,
                            Student_Industry:req.body.Student_Industry,
                            Student_CollegeName:req.body.Student_College,
                            Student_Experience:req.body.Student_Experience,
                            Student_Education_Level:req.body.Student_Education_Level,
                            Student_Email:req.body.Student_Email,
                            Student_Password:hashed_pass,
                            Student_MobileNo:req.body.Student_MObileNo,
                            Student_Country:req.body.Student_Country,
                            Student_BirthDate:req.body.Student_BirthDate,
                            Student_Address:req.body.Student_Address,
                            Student_TopSkills:req.body.Student_TopSkills
                        });
                        Student.save()
                            .then(result=>{
                                console.log(result);
                                res.status(201).json({
                                    message: 'User created'
                                });
                            })
                            .catch(err=>{
                                console.log(err);
                                res.status(500).json({
                                    error:err
                                });
                            });
                    }
                });
            }
        })


});

module.exports=app;