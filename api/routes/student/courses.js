const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const checkAuth = require('./../../middleware/check-auth');

const Enrollment = require('../../models/enrollment');
const Course = require('../../models/course');
const FacultyCourse = require('../../models/facultyCourse');

//enroll
router.post('/student/enrollment/:fc_id/:student_id',checkAuth,(req, res, next) => {
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

//view general courses
router.get('/view', function (req, res, next) {
    Course.find().exec().then(result => {

        if (!result.length) res.status(404).json({
            message: "data not found"
        });
        else res.status(200).json(result);
    }).catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

//view sub courses
router.get('/view/:course_id', function (req, res, next) {
    console.log("hello world"+req.params.course_id);
    FacultyCourse.find({course_id: req.params.course_id}).exec().then(result => {
        if (!result.length) res.status(404).json({
            message: "data not found"
        });
        else {
        console.log(result);
            res.status(200).json(result);
        }

    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//view specific subcourse
router.get('/view/:FC_id', function (req, res, next) {
    console.log(req.params.FC_id);
    FacultyCourse.find({_id: req.params.FC_id}).exec().then(result => {
        if (!result.length) res.status(404).json({
            message: "data not found"
        });
        else res.status(200).json(result);
    }).catch(err => {
        res.status(500).json(err);
    });
});



module.exports = router;