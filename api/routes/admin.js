const express = require('express');
const router = express.Router();

const facultyRoutes = require('./admin/faculties');
const studentRoutes = require('./admin/students');
router.use('/faculty',facultyRoutes);
router.use('/student',studentRoutes);
router.use('/login',function(req,res,next){
    
});


module.exports = router;