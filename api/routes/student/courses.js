const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const checkAuth = require('./../../middleware/check-auth');
const multer = require('multer');

const Enrollment = require('../../models/enrollment');
const Course = require('../../models/course');
const FacultyCourse = require('../../models/facultyCourse');
const Feedback = require('./../../models/feedback');
const StudentSubtopic = require('./../../models/studentSubtopic');
const Subtopic = require('./../../models/subtopic');
const studentSubtopic = require('./../../models/studentSubtopic');
const FcTest = require('./../../models/FcTest');
const Complaint = require('./../../models/complaint');
const feedback = require('./../../models/feedback');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/assignments');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

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
                    }});
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

//upload assignments
/*
router.patch('/upload/:subtopic_id', upload.single('subtopic_assignment'), function(req, res, next){
studentSubtopic.update({_id : req.body.subtopic_id, student_id : req.userData.student_id}, {$set : {
        subtopic_assignment_submission : req.file.originalname
    }}).then(data=>{
        res.status(200).json({
            data : data
        })
}).catch(err=>{
    res.status(500).json({
        error : err
    });
});
});
*/

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
router.get('/facultyCourse/:FC_id', function (req, res, next) {
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
router.get('/subtopics/:subtopic_id', checkAuth, (req, res, next) => {
    Subtopic.find({_id : req.params.subtopic_id}).exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => (req, res, next) => {
            res.status(500).json(err);
        })
});

//upload assignments
router.post('/assignment/:subtopic_id', checkAuth, upload.single('subtopic_assignment_submission'), (req, res, next) => {
    const studentSubtopic = new StudentSubtopic({
        _id : new mongoose.Types.ObjectId(),
        student_id : req.userData.student_id,
        subtopic_id : req.params.subtopic_id,
        subtopic_assignment_submission : "http://192.168.137.1:3000/uploads/assignments" + req.file.originalname,
        subtopic_assignment_submission_date : Date.now(),
    });
    studentSubtopic.save()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json(err)
        });
});

//get subtopics
router.get('/subtopic/:FC_id', checkAuth, (req, res, next) => {
    let sub_array = [];
    FacultyCourse.find({_id : req.params.FC_id}).exec()
        .then(result => {
            sub_array = result[0].facultyCourse_subtopics;
            Subtopic.find({_id : { $in : sub_array}}).exec()
                .then(result1 => {
                    res.status(200).json(result1);
                })
                .catch(err => {
                    res.status(500).json(err);
                })
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
});

//test
router.get('/test/:FC_id', checkAuth, (req, res, next) => {
    FcTest.find({FC_id : req.params.FC_id}).exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

router.post('/complain/:FC_id', checkAuth, (req, res, next) => {
    const complaint = new Complaint({
        _id : new mongoose.Types.ObjectId(),
        complaint_title : req.body.complaint_title,
        complaint_description : req.body.complaint_description,
        student_id :  req.userData.student_id,
        FC_id :  req.params.FC_id,
        complaint_date_posted : Date.now()
    });
    complaint.save()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json(err)
        });
});

//feedback
router.post('/feedback/:FC_id', checkAuth, (req, res, next) => {
    const feedback = new Feedback({
        _id : new mongoose.Types.ObjectId(),
        feedback_title : req.body.feedback_title,
        feedback_description : req.body.feedback_description,
        FC_id :  req.params.FC_id,
        feedback_date_posted : Date.now()
    });
    feedback.save()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json(err)
        });
});

module.exports = router;