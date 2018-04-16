const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Feedback = require('../../models/feedback');
const checkAuth = require('./../../middleware/check-auth');

router.get('/view', checkAuth,  function(req,res,next){
    Feedback.find({})
    .exec()
    .then(result=>{
      
        if(!result.length)
        {
            res.status(404).json({err: "No entries found"});
        }
        else res.status(200).json(result);

    }).catch(err=>{
        res.status(500).json(err);
    });
});

router.get('/view/:feedback_id', checkAuth,  function(req,res,next){
    Feedback.find({_id : req.params.feedback_id})
    .exec()
    .then(result=>{
      
        if(!result.length)
        {
            res.status(404).json({err: "No entries found"});
        }
        else res.status(200).json(result);

    }).catch(err=>{
        res.status(500).json(err);
    });
});