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
const Student = require('./../../models/student');

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
    Enrollment.find({student_id:req.userData.student_id})
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
                console.log("else");

                var enrollment_course = data[0].enrollment_course;
                enrollment_course.push({
                    FC_id:req.params.FC_id,
                    date:Date.now()
                });
                console.log("scope");
                console.log(enrollment_course);
                console.log("scope");
                Enrollment.update({student_id:req.userData.student_id},{$set: {
                        enrollment_course : enrollment_course
                    }}).then(data2=>{
                        console.log(data2);
                        console.log("updated");
                        res.status(200).json({message : "success"});
                }).catch(error2=>{
                    console.log("error");
                    res.status(500).json({error: error2});
                });
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
router.get('/viewFC/:course_id', function (req, res, next) {
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
            console.log(result[0].enrollment_course.length);
            for (let i = 0; i < result[0].enrollment_course.length; i++) {

                FC_Array.push((result[0].enrollment_course[i].FC_id));

                if(i === result[0].enrollment_course.length-1) {
                    console.log(FC_Array);
                    FacultyCourse.find({_id : { $in : FC_Array}}).exec()
                        .then(result1 => {
                            res.status(200).json(result1);
                            //console.log(result1);
                        }).catch(err2=>{
                            res.status(500).json({error:err2});
                    });
                }
            }

        });
});

// student takes test
router.get('/viewTest/:FC_id', (req, res, next) => {
    var questionsToSend = [];
    var count = 0;
    FcTest.find({ FC_id: req.params.FC_id }).exec().then(data => {
        if (data[0] === undefined) {
            res.status(404).json({
                message: "Woooo....no tests to view yet"
            });

        }
        else {
            questions = data[0].FcTest_questions;
            FcTestQuestion.find({ _id: { $in: questions } }).exec()
                .then(result1 => {
                    console.log(result1);

                    for (index in result1) {

                        var answers = result1[index].FcTestQuestion_answers;
                        console.log(answers);
                        var answersToSend = [];

                        for (var index2 = 0; index2 < answers.length; index2++) {
                            console.log(answers[index2]);
                            if (index2 == result1[index].FcTestQuestion_answer) {
                                answersToSend.push({
                                    text: answers[index2],
                                    correct: true
                                });
                            }
                            else {
                                answersToSend.push({
                                    text: answers[index2]
                                });
                            }
                            // console.log(answersToSend);
                        }

                        questionsToSend.push({
                            FcTestQuestion_text: result1[index].FcTestQuestion_text,
                            FcTestQuestion_answers: answersToSend
                        });

                    }
                    //  console.log(questionsToSend);
                    res.status(200).json(questionsToSend);
                })
                .catch(err => {
                    res.status(500).json(err);
                })

        }
    }).catch(err2 => {
        res.status(500).json({
            error: err2,
            message: "Your request failed with no seeming reason, try something better next time"
        });

    });

});

//students submits test
router.patch('test/submit/:FC_id', function (req, res, next) {
    Enrollment.find({ student_id: req.userData.student_id, FC_id: req.params.FC_id }).exec().then(data => {
        marks = [];
        marks = data[0].enrollment_course;
        marks.push( [{
            FC_id: mongoose.Schema.ObjectId,
            date: Date.now(),
            result: req.body.result
        }]);
        Enrollment.update({ student_id: req.userData.student_id, FC_id: req.body.FC_id }, { $set : {
                enrollment_course: marks
            }}).then(data2 => {
            res.status(200).json({
                message : "test submitted successfully"
            });
        }).catch(err2 => {
            res.status(500).json({
                message : "Something went wrong",
                error : err2
            });
        });
    }).catch(err => {
        res.status(500).json({
            message : "Something went wrong",
            error : err
        });
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