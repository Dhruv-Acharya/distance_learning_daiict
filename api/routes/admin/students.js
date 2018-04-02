const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Student = require('../../models/student');


router.get('/view', function(req,res,next){
    Student.find().exec().then(function(data){
        res.status(201).json(data);
    }).catch(function(err){
        res.status(500).json(err);
    });
});
module.exports = router;