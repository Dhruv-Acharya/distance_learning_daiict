const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Course = require('../../models/course');

router.get('/view', function(req,res,next){
Course.find().exec().then(response=>{
    if(!response.length) res.status(404).json({message : "No entries found"});
    else
    res.status(200).json(response);
    
}).catch(err=>{
    res.status(500).json({
        message:"Failed to fetch data",
        error:err
            });
      });
});

router.post('/add', function(req,res,next){
    const course = new Course({
        _id : new mongoose.Types.ObjectId(),
        course_subject : req.body.course_subject
    });
course.save().then(result =>{
res.status(201).json({
    message : "Data inserted successfully",
        });
    }).catch(err=>{
    res.status(500).json({
        message:"Something went wrong",
        error:err
        });
    });
});

router.delete('/remove/:course_id', function(req,res,next){
Course.remove({_id:req.params.course_id}).exec().then(result=>{
    res.status(200).json(result);
}).catch(err=>{
    res.status(500).json({
        message:"Something went wrong",
        error:err
});
    });
});

router.patch('/update/:course_id', function(req,res,next){
    Course.update({_id: req.params.course_id},{$set: {
        course_id : req.body.course_id,
        course_subject : req.body.course_subject} })
        .exec()
        .then(result => {
                res.status(200).json({
                    message : "Data updated successfully",
                    result : result
                });
        })
        .catch(err => {
            res.status(500).json({
                message : "something went wrong",
                error : err
            });
        });

});

module.exports = router;
