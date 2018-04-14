const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const Course = require('../../models/course');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/courses');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({storage: storage});

const checkAuth = require('./../../middleware/check-auth');

router.get('/view', checkAuth, function (req, res, next) {
    Course.find({}).exec().then(response => {
        if (!response.length) res.status(404).json({message: "No entries found"});
        else
            res.status(200).json(response);

    }).catch(err => {
        res.status(500).json({
            message: "Failed to fetch data",
            error: err
        });
    });
});

router.get('/view/ :course_id', checkAuth, function (req, res, next) {
    Course.find({_id: req.params.course_id}).exec().then(response => {
        if (!response.length) res.status(404).json({message: "No entries found"});
        else
            res.status(200).json(response);

    }).catch(err => {
        res.status(500).json({
            message: "Failed to fetch data",
            error: err
        });
    });
});

router.post('/add', checkAuth, upload.single('course_photo'), function (req, res, next) {
    console.log(req);
    const course = new Course({
        _id: new mongoose.Types.ObjectId(),
        course_subject: req.body.course_subject,
        course_photo: "http://192.168.137.1:3000/uploads/courses/" + req.file.originalname,
        course_description: req.body.course_description
    });
    course.save().then(result => {
        res.status(201).json({
            message: "Data inserted successfully",
        });
    }).catch(err => {
        res.status(500).json({
            message: "Something went wrong",
            error: err
        });
    });
});

router.delete('/remove/:course_id', checkAuth, function (req, res, next) {
    Course.remove({_id: req.params.course_id}).exec().then(result => {
        res.status(200).json(result);
    }).catch(err => {
        res.status(500).json({
            message: "Something went wrong",
            error: err
        });
    });
});

router.patch('/update/:course_id', checkAuth, upload.single('course_photo'), function (req, res, next) {
    Course.update({_id: req.params.course_id}, {
        $set: {
            course_subject: req.body.course_subject,
            course_description: req.body.course_description,
            course_photo: "http://192.168.137.1:3000/uploads/courses/" + req.file.originalname
        }
    })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Data updated successfully",
                result: result
            });
        })
        .catch(err => {
            res.status(500).json({
                message: "something went wrong",
                error: err
            });
        });

});

module.exports = router;
