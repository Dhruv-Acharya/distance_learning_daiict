const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const FacultyCourse = require('../../models/facultyCourse');
const Subtopic = require('../../models/subtopic');
const TeachingAssistant = require('./../../models/teachingAssistant');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/facultyCourses');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({storage: storage});

//view general courses
router.get('/view', function (req, res, next) {
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

//get TA list for create course
router.get('/getTA', (req, res, next) => {
    TeachingAssistant.find().exec()
        .then(result => {
            res.status(200).json({result});
        })
        .catch(err => {
            res.status(500).json({err});
        });
});

//view sub courses
router.get('/view/:course_id', function (req, res, next) {
    FacultyCourse.find({course_id: req.params.course_id}).exec().then(result => {
        if (!result.length) res.status(404).json({
            message: "data not found"
        });
        else res.status(200).json(result);
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

//create courses
router.post('/create', upload.any(), function (req, res, next) {
    console.log(req.body);
    var i = 1;
    var subtopicArray = [];
    console.log(req.body.facultyCourse_subtopics['0']);
    for (subtopic in req.body.facultyCourse_subtopics) {
        var subtopic = new Subtopic({
            _id: new mongoose.Types.ObjectId(),
            subtopic_name: subtopic.subtopic_name,
            subtopic_assignment: "http://192.168.137.1:3000/uploads/facultyCourses/" + req.files[i].originalname,
            subtopic_video: "http://192.168.137.1:3000/uploads/facultyCourses/" + req.files[i + 1].originalname,
            subtopic_description: subtopic.subtopic_description,
            subtopic_weightage: subtopic.subtopic_weightage,
            subtopic_assignment_totalMarks: subtopic.subtopic__assignment_totalMarks
        });
        subtopicArray.push(subtopic._id);
        i += 2;
        console.log("into it");
    }
    const facultyCourse = new FacultyCourse({
        _id: new mongoose.Types.ObjectId(),
        course_id: req.body.course_id,
        faculty_id: req.body.faculty_id,
        facultyCourse_duration: req.body.facultyCourse_duration,
        facultyCourse_description: req.body.facultyCourse_description,
        facultyCourse_image: "http://192.168.137.1:3000/uploads/facultyCourses/" + req.files[0].originalname,
        facultyCourse_ta_require: req.body.facultyCourse_ta_require,
        facultyCourse_ta_list: req.body.facultyCourse_ta_list,
        facultyCourse_prerequisites: req.body.facultyCourse_prerequisites,
        facultyCourse_subtopics: subtopicArray
    });
    facultyCourse.save().exec().then(result => {
        res.status(201).json(result);
    }).catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

//update course
router.patch('/update/:course_id', upload.any(), function (req, res, next) {
    var i = 1;
    var subtopicArray = [];
    for (subtopic in req.body.subtopics) {
        var subtopic = new Subtopic({
            _id: new mongoose.Types.ObjectId(),
            subtopic_name: subtopic.subtopic_name,
            subtopic_assignment: "http://192.168.137.1:3000/uploads/facultyCourses/" + req.files[i].originalname,
            subtopic_video: "http://192.168.137.1:3000/uploads/facultyCourses/" + req.files[i + 1].originalname,
            subtopic_description: subtopic.subtopic_description,
            subtopic_weightage: subtopic.subtopic_weightage,
            subtopic_assignment_totalMarks: subtopic.subtopic__assignment_totalMarks
        });
    }

    FacultyCourse.update({_id: req.params.course_id}, {
        $set: {
            facultyCourse_duration: req.body.facultyCourse_duration,
            facultyCourse_description: req.body.facultyCourse_description,
            facultyCourse_image: "http://192.168.137.1:3000/uploads/facultyCourses/" + req.files[0].originalname,
            facultyCourse_ta_require: req.body.facultyCourse_ta_require,
            facultyCourse_ta_list: req.body.facultyCourse_ta_list,
            facultyCourse_prerequisites: req.body.facultyCourse_prerequisites,
            facultyCourse_subtopics: subtopicArray
        }
    })
        .exec().then(result => {
        if (!result.length) res.status(404).json({
            message: "data not found"
        });
        else res.status(200).json(result);
    }).catch(err => {
        res.json({
            error: err
        });
    });

});

//delete course
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