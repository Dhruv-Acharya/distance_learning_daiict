const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const faculty = require('../models/faculty');
const courseRoutes = require('./faculty/courses');

router.use('/course',courseRoutes);

router.post('/login',function(req,res,next){
    faculty.find({faculty_email:req.body.faculty_email})
       .exec()
       .then(data => {
           if(!data.length){
               return res.status(404).json({
                   message: 'User not found'
               });
           }
           else{
            bcrypt.compare(req.body.faculty_password,data[0].faculty_password,(err,result)=>{
               if(err) {
                       return res.status(401).json({
                            message: 'Invalid email or password'
                        });
                   }
                   if(result){
                       const token = jwt.sign(
                           {
                               _id:data[0]._id,
                           },
                           "nevermind",
                           {
                               expiresIn:'1h'
                           }
                       );
                       return  res.status(200).json({
                           message:'Login successful',
                           token:token
                       });
                   }
               });
           }
       }).catch(err=>{
           console.log(err);
           res.status(500).json({
               error:err
           });
        });
});
module.exports = router;