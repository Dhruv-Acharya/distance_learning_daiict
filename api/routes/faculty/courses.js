const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('./../../middleware/check-auth');

const FacultyCourse = require('../../models/facultyCourse');
const Subtopic = require('../../models/subtopic');
const TeachingAssistant = require('./../../models/teachingAssistant');
const Course = require('./../../models/course');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/facultyCourses');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });
/*
//view general courses
router.get('/view', function (req, res, next) {
    FacultyCourse.find().exec().then(result => {
        console.log(result);
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
*/
//view general courses
router.get('/basic', checkAuth, function (req, res, next) {
    Course.find().exec().then(result => {

        if (!result.length) res.status(404).json({
            message: "data not found"
        });
        else
        {
            console.log(result);
            res.status(200).json({
                data : result
            });
        }
    }).catch(err => {
        console.log("<-_->Altair got some error")
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
/*
//view sub courses
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
*/
//view specific subcourse
router.get('/view', checkAuth, function (req, res, next) {
    FacultyCourse.find({faculty_id: req.userData.faculty_id}).exec().then(result => {
        if (!result.length) res.status(404).json({
            message: "data not found"
        });
        else res.status(200).json(result);
    }).catch(err => {
        res.status(500).json(err);
    });
});
/*
//create courses
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
            subtopic_assignment: "http://192.168.137.1:3000/uploads/facultyCourses/" + req.files[aux].originalname,
            subtopic_video: "http://192.168.137.1:3000/uploads/facultyCourses/" + req.files[aux+1].originalname,
            subtopic_description: subtopics[index].subtopic_description,
            subtopic_weightage: subtopics[index].subtopic_weightage,
            subtopic_assignment_totalMarks: subtopics[index].subtopic__assignment_totalMarks
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
                    console.log("failed to save, try something better next time");
                    console.log(err);
                    res.status(500).json({
                        error: err,
                        msg: "Failed to save, but you can always retry"
                    });
                });
            }
        }).catch(error => {
            console.log(error);
        });
        console.log("<-_->Altair");
    aux+=2;
    }
});
*/
/*
router.post('/create', checkAuth, upload.any(), function (req, res, next) {
    //console.log(req);
    var subtopicArray = [];
    var i = 1;
    var aux = 1;

    var subtopics = JSON.parse(req.body.facultyCourse_subtopics);
    var ta_list = JSON.parse(req.body.facultyCourse_ta_list);

    for (var index in subtopics) {
        var subtopicItem = new Subtopic({
            _id: new mongoose.Types.ObjectId(),
            subtopic_name: subtopics[index].subtopic_name,
            subtopic_video: "http://192.168.137.1:3000/uploads/facultyCourses/" + req.files[aux].originalname,
            subtopic_assignment: "http://192.168.137.1:3000/uploads/facultyCourses/" + req.files[aux+1].originalname,
            subtopic_description: subtopics[index].subtopic_description,
            subtopic_weightage: subtopics[index].subtopic_weightage,
            subtopic_assignment_totalMarks: subtopics[index].subtopic__assignment_totalMarks
        });
        subtopicItem.save().then(data => {
            console.log(data);
            subtopicArray.push(data._id);
            i++;
            console.log(i);
            if (i == subtopics.length + 1) {
                const facultyCourse = new FacultyCourse({
                    _id: new mongoose.Types.ObjectId(),
                    course_id: "5ad052de844bc805288b4527",
                    faculty_id: req.userData.faculty_id,
                    facultyCourse_name: req.body.facultyCourse_name,
                    facultyCourse_duration: req.body.facultyCourse_duration,
                    facultyCourse_description: req.body.facultyCourse_description,
                    facultyCourse_image: "http://192.168.137.1:3000/uploads/facultyCourses/" + req.files[0].originalname,
                    facultyCourse_ta_require : req.body.facultyCourse_ta_require,
                    facultyCourse_ta_list : ta_list,
                    facultyCourse_prerequisites: req.body.facultyCourse_prerequisites,
                    facultyCourse_subtopics: subtopicArray
                });
                console.log(facultyCourse);
                facultyCourse.save().then(result => {
                    console.log("saved");
                    res.status(201).json(result);
                }).catch(err => {
                    console.log("failed to save, try something better next time");
                    console.log(err);
                    res.status(500).json({
                        error: err,
                        msg: "Failed to save, but you can always retry"
                    });
                });
            }
        }).catch(error => {
            console.log(error);
        });
        console.log("<-_->Altair is watching");
        aux+=2;
    }
});
*/

//create courses
router.post('/create', checkAuth, upload.any(), function (req, res, next) {
    //console.log(req);
    var subtopicArray = [];
    var i = 1;
    var aux = 1;

    var subtopics = JSON.parse(req.body.facultyCourse_subtopics);
    var ta_list = JSON.parse(req.body.facultyCourse_ta_list);

    for (var index in subtopics) {
        var subtopicItem = new Subtopic({
            _id: new mongoose.Types.ObjectId(),
            subtopic_name: subtopics[index].subtopic_name,
            subtopic_video: "http://192.168.137.1:3000/uploads/facultyCourses/" + req.files[aux].originalname,
            subtopic_assignment: "http://192.168.137.1:3000/uploads/facultyCourses/" + req.files[aux+1].originalname,
            subtopic_description: subtopics[index].subtopic_description,
            subtopic_weightage: subtopics[index].subtopic_weightage,
            subtopic_assignment_totalMarks: subtopics[index].subtopic__assignment_totalMarks
        });
        subtopicItem.save().then(data => {
            console.log(data);
            subtopicArray.push(data._id);
            i++;
            console.log(i);
            if (i == subtopics.length + 1) {
                const facultyCourse = new FacultyCourse({
                    _id: new mongoose.Types.ObjectId(),
                    course_id: req.body.course_id,
                    faculty_id: req.userData.faculty_id,
                    facultyCourse_name: req.body.facultyCourse_name,
                    facultyCourse_duration: req.body.facultyCourse_duration,
                    facultyCourse_description: req.body.facultyCourse_description,
                    facultyCourse_image: "http://192.168.137.1:3000/uploads/facultyCourses/" + req.files[0].originalname,
                    facultyCourse_ta_require : req.body.facultyCourse_ta_require,
                    facultyCourse_ta_list : ta_list,
                    facultyCourse_prerequisites: req.body.facultyCourse_prerequisites,
                    facultyCourse_subtopics: subtopicArray
                });
                console.log(facultyCourse);
                facultyCourse.save().then(result => {
                    console.log("saved");
                    res.status(201).json(result);
                }).catch(err => {
                    console.log("failed to save, try something better next time");
                    console.log(err);
                    res.status(500).json({
                        error: err,
                        msg: "Failed to save, but you can always retry"
                    });
                });
            }
        }).catch(error => {
            console.log(error);
        });
        console.log("<-_->Altair is watching");
        aux+=2;
    }
});

//get course info
router.get('/viewFacultyCourseInfo/:FC_id', checkAuth, function (req, res, next){
    let sub_array = [];
    FacultyCourse.find({_id : req.params.FC_id}).exec()
        .then(result => {
            sub_array = result[0].facultyCourse_subtopics;
            Subtopic.find({_id : { $in : sub_array}}).exec()
                .then(result1 => {
                    res.status(200).json({course : result[0],subtopic :result1});
                })
                .catch(err => {
                    res.status(500).json(err);
                })
        })
        .catch(err => (req, res, next) => {
            res.status(500).json(err);
        });
});

//update course
router.patch('/update/:course_id', checkAuth, upload.any(), function (req, res, next) {
    //console.log(req);
    var subtopicArray = [];
    var i = 1;
    var aux = 1;

    var subtopics = JSON.parse(req.body.facultyCourse_subtopics);
    var ta_list = JSON.parse(req.body.facultyCourse_ta_list);

    for (var index in subtopics) {
        var subtopicItem = new Subtopic({
            _id: new mongoose.Types.ObjectId(),
            subtopic_name: subtopics[index].subtopic_name,
            subtopic_video: "http://192.168.137.1:3000/uploads/facultyCourses/" + req.files[aux].originalname,
            subtopic_assignment: "http://192.168.137.1:3000/uploads/facultyCourses/" + req.files[aux+1].originalname,
            subtopic_description: subtopics[index].subtopic_description,
            subtopic_weightage: subtopics[index].subtopic_weightage,
            subtopic_assignment_totalMarks: subtopics[index].subtopic__assignment_totalMarks
        });
        Subtopic.save().then(data => {
            console.log(data);
            subtopicArray.push(data._id);
            i++;
            console.log(i);
            if (i == subtopics.length + 1) {
                const facultyCourse = new FacultyCourse({
                    _id: new mongoose.Types.ObjectId(),
                    course_id: "5ad052de844bc805288b4527",
                    faculty_id: req.userData.faculty_id,
                    facultyCourse_name: req.body.facultyCourse_name,
                    facultyCourse_duration: req.body.facultyCourse_duration,
                    facultyCourse_description: req.body.facultyCourse_description,
                    facultyCourse_image: "http://192.168.137.1:3000/uploads/facultyCourses/" + req.files[0].originalname,
                    facultyCourse_ta_require : req.body.facultyCourse_ta_require,
                    facultyCourse_ta_list : ta_list,
                    facultyCourse_prerequisites: req.body.facultyCourse_prerequisites,
                    facultyCourse_subtopics: subtopicArray
                });
                console.log(facultyCourse);
                facultyCourse.save().then(result => {
                    console.log("saved");
                    res.status(201).json(result);
                }).catch(err => {
                    console.log("failed to save, try something better next time");
                    console.log(err);
                    res.status(500).json({
                        error: err,
                        msg: "Failed to save, but you can always retry"
                    });
                });
            }
        }).catch(error => {
            console.log(error);
        });
        console.log("<-_->Altair is watching");
        aux+=2;
    }
});
/*
//update course
router.patch('/update/:course_id', upload.any(), function (req, res, next) {
    //console.log(req);
    var subtopicArray = [];
    var i = 1;
    var aux = 1;

    var subtopics = JSON.parse(req.body.facultyCourse_subtopics);

    for (var index in subtopics) {
        var subtopicItem = new Subtopic({
            _id: new mongoose.Types.ObjectId(),
            subtopic_name: subtopics[index].subtopic_name,
            subtopic_assignment: "http://192.168.137.1:3000/uploads/facultyCourses/" + req.files[aux].originalname,
            subtopic_video: "http://192.168.137.1:3000/uploads/facultyCourses/" + req.files[aux+1].originalname,
            subtopic_description: subtopics[index].subtopic_description,
            subtopic_weightage: subtopics[index].subtopic_weightage,
            subtopic_assignment_totalMarks: subtopics[index].subtopic__assignment_totalMarks
        });
        subtopicItem.save().then(data => {
            console.log(data);
            subtopicArray.push(data._id);
            i++;
            console.log(i);
            if (i == subtopics.length + 1) {
                console.log(facultyCourse);
                facultyCourse.update({_id : req.params.course_id},{$set:{
                    facultyCourse_name: req.body.facultyCourse_name,
                    facultyCourse_duration: req.body.facultyCourse_duration,
                    facultyCourse_description: req.body.facultyCourse_description,
                    facultyCourse_image: "https://sheltered-spire-10162.herokuapp.com/" + req.files[0].path,
                    facultyCourse_ta_require : req.body.facultyCourse_ta_require,
                    facultyCourse_ta_list : req.body.facultyCourse_ta_list,
                    facultyCourse_prerequisites: req.body.facultyCourse_prerequisites,
                    facultyCourse_subtopics: subtopicArray
                }}).then(result => {
                    console.log("updated successfully....like a boss");
                    res.status(201).json(result);
                }).catch(err => {
                    console.log("failed to update, please try something better next time");
                    console.log(err);
                    res.status(500).json({
                        error: err,
                        msg: "We hate to admit it but something went wrong"
                    });
                });
            }
        }).catch(error => {
            console.log(error);
        });
        console.log("<-_->Altair");
    }
});
*/
//delete course
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