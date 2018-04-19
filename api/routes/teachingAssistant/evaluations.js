const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const FacultyCourse = require('../../models/facultyCourse');
const studentSubtopic = require('../../models/studentSubtopic');
const Subtopic = require('../../models/subtopic');

const checkAuth = require('./../../middleware/check-auth');


//ta view
router.get('/view', checkAuth, function (req, res, next) {
    let fc_list = [];
    let ta_list = [];
    let i;
    FacultyCourse.find().exec().then(result => {
        for( i=0; i<result.length; i++ ){
            ta_list=result[i].facultyCourse_ta_list;
            if(ta_list.indexOf(req.userData.ta_id)>-1) {
                fc_list.push(result[i]._id);
            }/*
            console.log(fc_list);
            console.log(fc_list.indexOf("5acf082fbe48f5250812c7f3"));*/
        }
        while(i<result.length) {

        }
        FacultyCourse.find({_id : {$in : fc_list}}).exec()
            .then(final_list_FC => {
                res.status(200).json(final_list_FC);
            })
            .catch(err => {
                res.status(500).json(err);
            });
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
            console.log(result);
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
        if (!result.length)
            res.status(404).json({
                message: "data not found"
            });
        else res.status(200).json(result);
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


router.get('/evaluation/:FC_id/:student_id', function (req, res, next) {
    studentSubtopic.find({ FC_id: req.params.FC_id, student_assignment: { $exists: true }, student_id : req.params.student_id }).exec().then(result => {
        if (!result.length)
            res.status(404).json({
                message: "data not found"
            });
        else res.status(200).json(result);
    }).catch(err => {
        res.status(500).json(err);
    });
});

router.delete('/delete/:course_id', function (req, res, next) {
    FacultyCourse.remove({ _id: req.params.course_id })
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

router.get('/enrolled', (req, res, next) => {
    let FC_Array =[];
    FacultyCourse.find().exec()
        .then(result => {
            for (let i = 0; i < result.length; i++) {
                FC_Array.push((result[i].facultyCourse_ta_list[0]));
                console.log(result[i].facultyCourse_ta_list[0]);
            }console.log(FC_Array);
            /*FacultyCourse.find({_id : { $in : FC_Array}}).exec()
                .then(result1 => {
                    res.status(200).json(result1);
                    console.log(result1);
                });*/
        });
});

module.exports = router;