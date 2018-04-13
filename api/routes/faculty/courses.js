const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const FacultyCourse = require('../../models/facultyCourse');
const Subtopic = require('../../models/subtopic');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/facultyCourses');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

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

router.get('/view/:course_id', function (req, res, next) {
    FacultyCourse.find({ _id: req.params.course_id }).exec().then(result => {
        if (!result.length) res.status(404).json({
            message: "data not found"
        });
        else res.status(200).json(result);
    }).catch(err => {
        res.status(500).json(err);
    });
});

router.post('/create', upload.any(), function (req, res, next) {
    //console.log(req);
    var subtopicArray = [];
    var i = 1;
    var aux = 1;

    var subtopics = JSON.parse(req.body.facultyCourse_subtopics);

    for (var index in subtopics) {
        var subtopicItem = new Subtopic({
            _id: new mongoose.Types.ObjectId(),
            subtopic_name: subtopics[index].subtopic_name,
            subtopic_assignment: "http://192.168.137.1:3000/uploads/facultyCourses/" + req.files[1].originalname,
            subtopic_video: "http://192.168.137.1:3000/uploads/facultyCourses/" + req.files[2].originalname,
            subtopic_description: subtopics[0].subtopic_description,
            subtopic_weightage: subtopics[0].subtopic_weightage,
            subtopic_assignment_totalMarks: subtopics[0].subtopic__assignment_totalMarks
        });
        subtopicItem.save().then(data => {
            console.log(data);
            subtopicArray.push(data._id);
            i++;
            console.log(i);
            if (i == subtopics.length + 1) {
                const facultyCourse = new FacultyCourse({
                    _id: new mongoose.Types.ObjectId(),
                    course_id: "5acc8874e1d10b0694fab3a8",
                    faculty_id: "5ace1a007c239b001490d89f",
                    facultyCourse_name: req.body.facultyCourse_name,
                    facultyCourse_duration: req.body.facultyCourse_duration,
                    facultyCourse_description: req.body.facultyCourse_description,
                    facultyCourse_image: "https://sheltered-spire-10162.herokuapp.com/" + req.files[0].path,
                    facultyCourse_ta_require : req.body.facultyCourse_ta_require,
                    facultyCourse_ta_list : req.body.facultyCourse_ta_list,
                    facultyCourse_prerequisites: req.body.facultyCourse_prerequisites,
                    facultyCourse_subtopics: subtopicArray
                });
                console.log(facultyCourse);
                facultyCourse.save().then(result => {
                    console.log("saved");
                    res.status(201).json(result);
                }).catch(err => {
                    console.log("failed to save");
                    console.log(err);
                    res.status(500).json({
                        error: err,
                        msg: "Failed to send"
                    });
                });
            }
        }).catch(error => {
            console.log(error);
        });
        console.log("Hello");
        console.log("aux is " + aux);
    }
});

router.patch('/update/:course_id', upload.any(), function (req, res, next) {
    var i = 1;
    var subtopicArray = [];
    for (subtopic in req.body.subtopics) {
        var subtopic = new Subtopic({
            _id: new mongoose.Types.ObjectId(),
            subtopic_name: subtopic.subtopic_name,
            subtopic_assignment: "https://sheltered-spire-10162.herokuapp.com/" + req.files[i].path,
            subtopic_video: "https://sheltered-spire-10162.herokuapp.com/" + req.files[i + 1].path,
            subtopic_description: subtopic.subtopic_description,
            subtopic_weightage: subtopic.subtopic_weightage,
            subtopic_assignment_totalMarks: subtopic.subtopic__assignment_totalMarks
        });
    }

    FacultyCourse.update({ _id: req.params.course_id }, {
        $set: {
            facultyCourse_duration: req.body.facultyCourse_duration,
            facultyCourse_description: req.body.facultyCourse_description,
            facultyCourse_image: "https://sheltered-spire-10162.herokuapp.com/" + req.files[0].path,
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