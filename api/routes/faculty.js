const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Faculty = require('../models/faculty');
const faculty= require('../../models/faculty');
const courseRoutes = require('./faculty/courses');
router.use('/course',courseRoutes);
router.use('/login',function(req,res,next){
faculty.find({faculty_name:req.body.faculty_name,faculty_password:req.body.faculty_password}).exec().then(function(data){
    if(!data.length){
        res.json({login:false});
    }
    else res.status(200).json(data);
}).catch(function(err){
res.status(500).json(err);
})

});
module.exports = router;