const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const checkAuth = require('./../../middleware/check-auth');

const Enrollment = require('../../models/enrollment');
const Course = require('../../models/course');
const FacultyCourse = require('../../models/facultyCourse');
const Subtopic = require('./../../models/subtopic');

const Complaint = require('./../../models/complaint');

//enroll
router.post('/enrollment/:FC_id', checkAuth,(req, res, next) => {
    Enrollment.find({student_id:req.params.student_id})
        .exec()
        .then(data=>{
            if(!data.length){
                const enroll=new Enrollment({
                    _id : new mongoose.Types.ObjectId(),
                    student_id : req.userData.student_id,
                    enrollment_course:{
                        FC_id:req.params.FC_id,
                        date:Date.now()
                    }
                });
                enroll.save().exec()
                    .then(result => {
                        res.status(200).json(result);
                    })
                    .catch(err => {
                        res.status(500).json(err);
                    });
            }else{
                const enrollment_course = data.enrollment_course;
                enrollment_course.push({
                    FC_id:req.params.FC_id,
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
    FacultyCourse.find({course_id: req.params.course_id}).exec().then(result => {
        if (!result.length) res.status(404).json({
            message: "data not found"
        });
        else {
            res.status(200).json(result);
        }

    }).catch(err => {
        res.status(500).json(err);
    });
});

//view specific subcourse
router.get('/view/:FC_id', function (req, res, next) {
    FacultyCourse.find({_id: req.params.FC_id}).exec().then(result => {
        if (!result.length) res.status(404).json({
            message: "data not found"
        });
        else res.status(200).json(result);
    }).catch(err => {
        res.status(500).json(err);
    });
});

//get subtopic details
router.get('/view/:subtopic_id', checkAuth, (req, res, next) => {
    Subtopic.find({_id : req.params.subtopic_id}).exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => (req, res, next) => {
            res.status(500).json(err);
        })
});

//get subtopics
router.get('/subtopic/:FC_id', checkAuth, (req, res, next) => {
    FacultyCourse.find({_id : req.params.FC_id}).exec()
        .then(result => {
            console.log(result[0].facultyCourse_subtopics);
            res.status(200).json(result[0].facultyCourse_subtopics);
        })
        .catch(err => (req, res, next) => {
            res.status(500).json(err);
        })
});

//get my course
router.get('/enrolled', checkAuth, (req, res, next) => {
    let FC_Array =[];
    Enrollment.find({student_id : req.userData.student_id}).exec()
        .then(result => {
            for (let i = 0; i < result.length; i++) {
                FC_Array.push((result[i].enrollment_course[0].FC_id));
                console.log(result[i].enrollment_course[0].FC_id);
            }console.log(FC_Array);
            FacultyCourse.find({_id : { $in : FC_Array}}).exec()
                .then(result1 => {
                    res.status(200).json(result1);
                    console.log(result1);
                });
        });
})

router.post('/complain/:FC_id', checkAuth, (req, res, next) => {
    const complaint = new Complaint({
        _id : new mongoose.Types.ObjectId(),
        complaint_title : req.body.complaint_title,
        complaint_description : req.body.complaint_description,
        student_id :  req.userData.student_id,
        FC_id :  req.params.FC_id,
        complaint_date_posted : Date.now()
    });
    complaint.save().exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json(err)
        });
});


module.exports = router;