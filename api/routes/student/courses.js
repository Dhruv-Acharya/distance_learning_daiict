const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const checkAuth = require('./../../middleware/check-auth');

const Enrollment = require('../../models/enrollment');
const Course = require('../../models/course');

router.post('/student/enrollment/:fc_id&:student_id',checkAuth,(req, res, next) => {
    Enrollment.find({student_id:req.params.student_id})
        .exec()
        .then(data=>{
            if(!data.length){
                const enroll=new Enrollment({
                    _id : mongoose.Schema.ObjectId(),
                    student_id : req.params.student_id,
                    enrollment_course:{
                        fc_id:req.params.fc_id,
                        date:Date.now()
                    }
                })
            }else{
                const enrollment_course = data.enrollment_course;
                enrollment_course.push({
                    fc_id:req.params.fc_id,
                    date:Date.now()
                });
                Enrollment.update({student_id:req.params.student_id},{$set: {
                        enrollment_course:enrollment_course
                    }})
            }
        })
        .catch(err => res.status(500).json({
            message: "Something went wrong",
            error: err
        }));
});

router.get('/view', function(req,res,next){
    Course.find({})
        .exec()
        .then(response => {
            if(!response.length){
                res.status(404).json({message : "No entries found"});
            }else(
                res.status(200).json(response)
            )
        })
        .catch(err=>{
            res.status(500).json({
                message:"Failed to fetch data",
                error:err
            });
        });
});


router.get('/view/ :course_id', function(req,res,next){
    Course.find({_id: req.params.course_id}).exec().then(response => {
        if(!response.length) res.status(404).json({message : "No entries found"});
        else
            res.status(200).json(response);

    }).catch(err=>{
        res.status(500).json({
            message:"Failed to fetch data",
            error:err
        });
    });
});


module.exports = router;