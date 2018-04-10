const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const FacultyCourse = require('../../models/facultyCourse');
const Subtopic = require('../../models/subtopic');
/*
faculty/course/view
2.3.	/faculty/course/view/:course_id
2.4.	/faculty/course/create
2.5.	/faculty/course/update/:course_id
2.6.	/faculty/course/remove/:course_id
*/

router.get('/view', function(req,res,next){
    FacultyCourse.find().exec().then(result =>{
      
        if(!result.length)res.status(404).json({
            message: "data not found"
        });
        else res.status(200).json(result);
    }).catch(err=>{
        res.status(500).json({
            error : err
        });
    });
    });

router.get('/view/:course_id', function(req,res,next){
    FacultyCourse.find({_id:req.params.course_id}).exec().then(result=>{
        if(!result.length)res.status(404).json({
            message: "data not found"
        });
        else res.status(200).json(result);
    }).catch(err=>{
        res.status(500).json(err);
    });
    });

router.post('/create',upload.any(), function(req,res,next){
var i=1;
var subtopicArray = [];
    for(subtopic in req.body.subtopics)
{ 
    var subtopic = new Subtopic ({
    _id : new mongoose.Types.ObjectId(),
    subtopic_name : subtopic.subtopic_name,
    subtopic_assignment : "https://sheltered-spire-10162.herokuapp.com/"+req.files[i].path,
    subtopic_video : "https://sheltered-spire-10162.herokuapp.com/"+req.files[i+1].path,
    subtopic_description : subtopic.subtopic_description,
    subtopic_weightage : subtopic.subtopic_weightage,
    subtopic_assignment_totalMarks : subtopic.subtopic__assignment_totalMarks
});
subtopicArray.push(subtopic._id);
i+=2;
}
    const facultyCourse = new FacultyCourse({
    _id: new mongoose.Types.ObjectId(),
    course_id : req.body.course_id,
    faculty_id : req.body.faculty_id,
    facultyCourse_duration : req.body.facultyCourse_duration,
    facultyCourse_description : req.body.facultyCourse_description,
    facultyCourse_image : "https://sheltered-spire-10162.herokuapp.com/"+req.files[0].path,
    facultyCourse_ta_require : req.body.facultyCourse_ta_require,
    facultyCourse_ta_list : req.body.facultyCourse_ta_list,
    facultyCourse_prerequisites : req.body.facultyCourse_prerequisites,
    facultyCourse_subtopics:subtopicArray
}); 
    facultyCourse.save().exec().then(result=>{
        res.status(201).json(result);
      }).catch(err=>{
          res.status(500).json({
              error : err
          });
      });
    });

router.patch('/update/:course_id', function(req,res,next){
    FacultyCourse.update({_id: req.params.course_id},{$set: {
    FacultyCourse_Duration:req.body.FacultyCourse_Duration,
    FacultyCourse_Description:req.body.FacultyCourse_Description,
    FacultyCourse_Assignments:req.body.FacultyCourse_Assignments
    } })
        .exec().then(result=>{
            if(!result.length)res.status(404).json({
                message: "data not found"
            });
            else res.status(200).json(result);
        }).catch(err=>{
            res.json({
                error : err
            });
        });
    
    });
router.delete('/delete/:course_id', function(req,res,next){
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