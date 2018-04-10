const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Complaint = require('../../models/complaint');
const checkAuth = require('./../../middleware/check-auth');

<<<<<<< HEAD
router.get('/view', function(req,res,next){
    Complaint.find()
=======
router.get('/view',  checkAuth, function(req,res,next){
    Complaint.find({})
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
router.patch('respond/:complaint_id', function(req,res,next){
Complaint.update({_id : req.params.complaint_id}, {$set : {
=======
router.patch('respond/:complaint_id', checkAuth, function(req,res,next){
Complaint.update({complaint_id : req.params.complaint_id}, {$set : {
>>>>>>> 75b69966ea4d2a12dcea0d3735bc5573cabc4b99
    complaint_response : req.body.complaint_response
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