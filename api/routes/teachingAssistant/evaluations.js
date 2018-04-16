const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const FacultyCourse = require('../../models/facultyCourse');
const studentSubtopic = require('../../models/studentSubtopic');
const Subtopic = require('../../models/subtopic');


router.get('/evaluation', function (req, res, next) {
    FacultyCourse.find().exec().then(result => {

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

router.get('/evaluation/:FC_id', function (req, res, next) {
    studentSubtopic.find({ FC_id: req.params.FC_id, student_assignment: { $exists: true } }).exec().then(result => {
        if (!result.length)
            res.status(404).json({
                message: "data not found"
            });
        else res.status(200).json(result);
    }).catch(err => {
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