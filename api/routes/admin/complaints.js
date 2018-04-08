const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Complaint = require('../../models/complaint');

router.get('/view', function(req,res,next){
    Complaint.find({})
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

router.patch('respond/:complaint_id', function(req,res,next){
Complaint.update({complaint_id : req.params.complaint_id}, {$set : {
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