var express=require("express");
var app = express();
var Student = require("../models/student");
var router = express.Router();
var bodyParser=require('body-parser');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
// routes for /student
//get on /login
app.post('/login',function(req,res,next){

});

router.post('/add',(req, res, next) =>{
    Student.find({student_email:req.body.student_email})
        .exec()
        .then(data => {
            if(data.length>=1){
                res.status(409).json({
                    message: 'Email already exists, try different email'
                });
            }else{
                bcrypt.hash(req.body.student_password,10,(err,hashed_pass)=> {
                    if(err) {
                        return res.status(500).json({
                            error:err
                        });
                    }else{
                        const student= new Student({
                            student_name : req.body.student_name,
                            //student_photo : req.file.path,
                            student_occupation : req.body.student_occupation,
                            student_industry : req.body.student_industry,
                            student_collegeName : req.body.student_collegeName,
                            student_experience : req.body.student_experience,
                            student_education_level : req.body.student_education_level,
                            student_email : req.body.student_email,
                            student_password : req.body.student_password,
                            student_contact_number : req.body.student_contact_number,
                            student_country : req.body.student_country,
                            student_birthdate : req.body.student_birthdate,
                            student_address : req.body.student_address
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