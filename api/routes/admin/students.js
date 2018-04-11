const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Student = require('../../models/student');
const checkAuth = require('./../../middleware/check-auth');

router.get('/view', checkAuth,  function(req,res,next){
    Student.find({})
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

module.exports = router;