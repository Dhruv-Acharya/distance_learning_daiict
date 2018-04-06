const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const FacultyCourse = require('../../models/facultyCourse');
/*
faculty/course/view
2.3.	/faculty/course/view/:course_id
2.4.	/faculty/course/create
2.5.	/faculty/course/update/:course_id
2.6.	/faculty/course/remove/:course_id
*/

router.get('/view', function(req,res,next){
    FacultyCourse.find().exec().then(function(data){
      res.status(201).json(data);
    }).catch(function(err){
        res.status(500).json(err);
    });
    });

router.get('/view/:courseID', function(req,res,next){
    FacultyCourse.find({Course_ID:req.params.courseID}).exec().then(function(data){
        res.status(201).json(data);
    }).catch(function(err){
        res.status(500).json(err);
    });
    });

router.post('/create', function(req,res,next){
    FacultyCourse.save(req.body).exec().then(function(data){
        res.status(201).json(data);
      }).catch(function(err){
          res.status(500).json(err);
      });
    });

router.patch('/update/:courseID', function(req,res,next){
    const courseID = req.params.courseID;
    FacultyCourse.update({Course_ID: courseID},{$set: {
    Faculty_ID:req.body.Faculty_ID,
    FacultyCourse_Duration:req.body.FacultyCourse_Duration,
    FacultyCourse_Description:req.body.FacultyCourse_Description,
    FacultyCourse_Assignments:req.body.FacultyCourse_Assignments
    } })
        .exec().then(function(data){
            res.status(201).json(data);
        }).catch(function(err){
            res.json(err);
        })
    
    });
router.delete('/delete/:courseID', function(req,res,next){
    const courseID = req.params.courseID;
    FacultyCourse.remove({Course_Id: courseID})
        .exec()
        .then(result => {
            res.status(201).json(result);
        })
        .catch(err => {
            res.status(500).json(err);
        });
    });
module.exports = router;