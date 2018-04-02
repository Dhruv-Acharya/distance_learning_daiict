const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Course = require('../../models/course');

router.get('/view', function(req,res,next){
    Course.find()
        .exec()
        .then(result => {
            if(result.length >= 0){
                res.status(200).json(result);
            }else {
                res.status(404).json({
                    message: "No entries found!"
                });
            }
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

router.post('/add', function(req,res,next){
Course.save(req.body).exec().then(function(data){
res.status(201).json(data);

}).catch(function(err){
    res.status(500).json({
        message:"Something went wrong",
        error:err
});
    });
});

router.delete('/course/remove/:courseID', function(req,res,next){
course.remove({Course_ID:req.params.courseID}).exec().then(function(data){
    res.status(201).json(data);
}).catch(function(err){
    res.status(500).json({
        message:"Something went wrong",
        error:err
});
    });
});

module.exports = router;
