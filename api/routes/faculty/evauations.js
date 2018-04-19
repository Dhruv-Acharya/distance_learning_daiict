const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const checkAuth = require('./../../middleware/check-auth');
const FacultyCourse = require('../../models/facultyCourse');
const studentSubtopic = require('../../models/studentSubtopic');
const Subtopic = require('../../models/subtopic');
const Student = require('../../models/student');

//views FC
router.get('/view', checkAuth, function (req, res, next) {
    FacultyCourse.find({faculty_id: req.userData.faculty_id}).exec().then(result => {
        if (result.length < 0) res.status(404).json({
            message: "data not found"
        });
        else res.status(200).json(result);
    }).catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

//views subtopic of FCs
router.get('/subtopics/view/:FC_id', checkAuth, function (req, res, next) {
    subtopic_list = [];
    let i;
    FacultyCourse.find({_id: req.params.FC_id}).exec()
        .then(result => {
            //console.log(result);
            subtopic_list = result[0].facultyCourse_subtopics;
            //console.log(subtopic_list);
            /*for (i = 0; i < result.length; i++) {
                subtopic_list.push(result[0].facultyCourse_subtopics[i]);
            }
            while(i<result.length) {

            }
            console.log(subtopic_list);*/
            Subtopic.find({_id: {$in: subtopic_list}}).exec().then(result_final => {
                if (!result_final.length) {
                    res.status(404).json({
                        message: "data not found"
                    });
                }
                else {
                    res.status(200).json(result_final);
                }
            }).catch(err => {
                res.status(500).json(err);
            });
        })
        .catch(err => {
            res.status(500).json(err);
        });

});

//views Student details of subtopics of FCs
router.get('/student/:subtopic_id', checkAuth, function (req, res, next) {
    studentSubtopic.find({
        subtopic_id : req.params.subtopic_id,
        subtopic_assignment_submission: {$exists: true}
    }).exec().then(result => {

        let std_id_arr = [];
        let std_name_arr = [];
        let j = 0;
        for (let i=0; i<result.length; i++){
            std_id_arr.push(result[i].student_id);
        }
        for (j = 0; j < std_id_arr.length; j++) {
            Student.find({_id : std_id_arr[j]}).exec()
                .then(result_name =>{
                    std_name_arr.push(result_name[0].student_name)
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json(err);
                });
        }
        /*
        Student.find({_id : {$in : std_id_arr}}).exec().then(student_name_temp => {*/
        const result_final = [];
        let i;
        for(i=0; i<result.length; i++) {
            result_final.push({
                _id : result[i]._id,
                student_name : std_name_arr[i],
                subtopic_assignment_submission : result[i].subtopic_assignment_submission,
                subtopic_assignment_submission_date : result[i].subtopic_assignment_submission_date
            });
        }
        while(i<result.length){

        }
        res.status(200).json(result_final);
        console.log(result_final);

        /*if (!result.length)
            res.status(404).json({
                message: "data not found"
            });
        else res.status(200).json(result);*/
    }).catch(err => {
        res.status(500).json(err);
    });
});

//view student subtopic info
router.get('/student/detail/:student_id/:subtopic_id', checkAuth, (req, res, next) => {
    studentSubtopic.find({student_id : req.params.student_id, subtopic_id: req.params.subtopic_id}).exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

//post aquired marks
router.patch('/student/detail/:ss_id', checkAuth, (req, res, next) => {
    studentSubtopic.update({_id : req.params.ss_id},{
        subtopic_assignment_acquiredMarks :req.body.subtopic_assignment_acquiredMarks,
        subtopic_assignment_evaluated_date : Date.now(),
        subtopic_completion : true
    }).exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

//posts grade for the assignment

/*
//views Student details of subtopics of FCs
router.get('/evaluation/:FC_id/:subtopic_id', function (req, res, next) {
    studentSubtopic.find({
        faculty_id: req.params.faculty_id,
        FC_id: req.params.FC_id,
        student_assignment: {$exists: true},
        student_id: req.params.student_id
    }).exec().then(result => {
        if (!result.length)
            res.status(404).json({
                message: "data not found"
            });
        else res.status(200).json(result);
    }).catch(err => {
        res.status(500).json(err);
    });
});
*/

router.delete('/delete/:course_id', function (req, res, next) {
    FacultyCourse.remove({_id: req.params.course_id})
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json(err);
        });
});
module.exports = router;