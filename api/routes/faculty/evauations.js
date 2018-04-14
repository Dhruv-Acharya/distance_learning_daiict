const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const FacultyCourse = require('../../models/facultyCourse');
const studentSubtopic = require('../../models/studentSubtopic');
const Subtopic = require('../../models/subtopic');


router.get('/evaluation/:faculty_id', function (req, res, next) {
    FacultyCourse.find({faculty_id : req.params.faculty_id}).exec().then(result => {
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

router.get('/evaluation/:faculty_id/:FC_id', function (req, res, next) {
    studentSubtopic.find({ faculty_id : req.params.faculty_id, FC_id: req.params.FC_id, student_assignment: { $exists: true } }).exec().then(result => {
        if (!result.length)
            res.status(404).json({
                message: "data not found"
            });
        else res.status(200).json(result);
    }).catch(err => {
        res.status(500).json(err);
    });
});

router.get('/evaluation/:faculty_id/:FC_id/:student_id', function (req, res, next) {
    studentSubtopic.find({ faculty_id : req.params.faculty_id, FC_id: req.params.FC_id, student_assignment: { $exists: true }, student_id : req.params.student_id }).exec().then(result => {
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
module.exports = router;