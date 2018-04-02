const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Course = require('../../models/course');

router.get('/view', function(req,res,next){
Course.find().exec().then(function (data){
    res.status(201).json({
        message: "Data fetched Successfully!",
        data: result
    });
    
}).catch(function(err){
    res.status(500).json({
        message:"Failed to fetch data",
        error:err
            });
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
