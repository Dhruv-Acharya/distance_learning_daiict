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
    Student.find({Student_email:req.body.Student_email})
        .exec()
        .then(std => {
            if(std.length>=1){
                res.status(409).json({
                    message: 'Email already existed, try different email'
                });
            }else{
                bcrypt.hash(req.body.Student_password,10,(err,hash)=> {
                    if(err) {
                        return res.status(500).json({
                            error:err
                        });
                    }else{
                        const std= new Student({
                            _id:new mongoose.Types.ObjectId(),
                            Student_email:req.body.Student_email,
                            Student_password: hash
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
    Student.find({Student_email:req.body.Student_email})
        .exec()
        .then(std => {
            if(std.length<1){
                return res.status(401).json({
                    message: 'Email doesn\'t exist, please enter valid email'
                });
            }
            bcrypt.compare(req.body.Student_password,TA[0].Student_password,(err,result)=>{
                if(err) {
                    return res.status(401).json({
                        message: 'Email or password incorrect'
                    });
                }
                if(result){
                    const token = jwt.sign(
                        {
                            Student_email:std[0].Student_email,
                            Student_id:std[0]._id
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
router.delete('/delete/:TA_id',(req,res,next)=>{
    Student.remove({_id:req.params.Student_id})
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
    Student.update({_id: StudentID},{$set: {Student_id: req.body.Student_id,
        Student_name: req.body.Student_name,
        Student_photo: req.body.Student_photo,
        Student_email: req.body.Student_email,
        Student_password: req.body.Student_password,
        Student_contact_number: req.body.Student_contact_number,
        Student_occupation: req.body.Student_occupation,
        Student_industry: req.body.Student_industry,
        Student_collage_name: req.body.Student_collage_name,
        Student_experience_level: req.body.Student_experience_level,
        Student_gender: req.body.Student_gender,
        Student_birthdate: req.body.Student_birthdate,
        Student_Address: req.body.Student_Address,
        Student_topSkills: req.body.Student_topSkills,
        Student_educational_details: req.body.Student_educational_details
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