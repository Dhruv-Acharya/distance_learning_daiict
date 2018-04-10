const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Inquiry = require('../../models/inquiry');
const checkAuth = require('./../../middleware/check-auth');

<<<<<<< HEAD
router.get('/view', function(req,res,next){
    Inquiry.find()
=======
router.get('/view', checkAuth,  function(req,res,next){
    Inquiry.find({})
>>>>>>> 75b69966ea4d2a12dcea0d3735bc5573cabc4b99
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

<<<<<<< HEAD
router.patch('respond/:inquiry_id', function(req,res,next){
        Inquiry.update({_id : req.params.inquiry_id}, {$set : {
=======
router.patch('respond/:inquiry_id', checkAuth,  function(req,res,next){
        Inquiry.update({inquiry_id : req.params.inquiry_id}, {$set : {
>>>>>>> 75b69966ea4d2a12dcea0d3735bc5573cabc4b99
            inquiry_response : req.body.inquiry_response
        }
        
        }).exec().then(result =>{
            res.status(200).json(result);
        }).catch(err =>{
            res.status(500).json({
                error : err
            });
        });
        
        });
module.exports = router;