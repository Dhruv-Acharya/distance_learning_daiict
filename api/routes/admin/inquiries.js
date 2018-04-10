const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Inquiry = require('../../models/inquiry');

router.get('/view', function(req,res,next){
    Inquiry.find()
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

router.patch('respond/:inquiry_id', function(req,res,next){
        Inquiry.update({_id : req.params.inquiry_id}, {$set : {
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