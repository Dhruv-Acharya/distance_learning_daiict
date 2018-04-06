const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const multer=require('multer');
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./Images/');
    },
    filename:function(req,file,cb){
        cb(null,new Date().toISOString()+file.originalname);
    }
});
const upload = multer({storage:storage});
const Student = require('../../models/student');

// Signup
router.post('/signup',(req, res, next) =>{
    //console.log(req.file);
    Student.find({student_email:req.body.student_email})
        .exec()
        .then(std => {
            if(std.length>=1){
                res.status(409).json({
                    message: 'Email already existed, try different email'
                });
            }else{
                bcrypt.hash(req.body.student_password,10,(err,hash)=> {
                    if(err) {
                        return res.status(500).json({
                            error:err
                        });
                    }else{
                        const std= new Student({
                            _id:new mongoose.Types.ObjectId(),
                            student_email:req.body.student_email,
                            student_password: hash
                        });
                        std.save()
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

// Login
router.post('/login',(req,res,next)=>{
    Student.find({student_email:req.body.student_email})
        .exec()
        .then(std => {
            if(std.length<1){
                return res.status(401).json({
                    message: 'Email doesn\'t exist, please enter valid email'
                });
            }
            bcrypt.compare(req.body.student_password,std[0].student_password,(err,result)=>{
                if(err) {
                    return res.status(401).json({
                        message: 'Email or password incorrect'
                    });
                }
                if(result){
                    const token = jwt.sign(
                        {
                            student_email:std[0].student_email,
                            student_id:std[0]._id
                        },
                        "secret",
                        {
                            expiresIn:'1h'
                        }
                    );
                    return  res.status(200).json({
                        message:'Login successful',
                        token:token
                    });
                }
                res.status(401).json({
                    message: 'Email doesn\'t exist, please enter valid email'
                });
            });

        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error:err
            });
        });
});

// Delete
router.delete('/delete/:Student_id',(req,res,next)=>{
    Student.remove({_id:req.params.student_id})
        .exec()
        .then(result=>{
            res.status(200).json({
                message: 'User successfully deleted'
            });
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error:err
            });
        });
});

// Edit Profile
router.patch('/editprofile/:StudentID',(req, res, next) => {

    const StudentID = req.params.StudentID;
    Student.update({_id: StudentID},{$set: {student_id: req.body.student_id,
        student_name: req.body.student_name,
        student_photo: req.body.student_photo,
        student_email: req.body.student_email,
        student_password: req.body.student_password,
        student_contact_number: req.body.student_contact_number,
        student_educational_details: req.body.student_educational_details,
        student_occupation: req.body.student_occupation,
        student_industry: req.body.student_industry,
        student_collage: req.body.student_collage,
        student_experience_level: req.body.student_experience_level,
        student_gender: req.body.student_gender,
        Student_birthdate: req.body.student_birthdate,
        student_Address: req.body.student_Address,
        student_topSkills: req.body.student_topSkills
    } })
        .exec()
        .then(result=>{
            res.status(200).json({
                message: 'User Profile updated successfully'
            });
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error:err
            });
        });
});

module.exports = router;