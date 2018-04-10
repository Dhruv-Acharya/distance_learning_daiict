const express = require('express');
const router = express.Router();
const Admin = require('../models/admin');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const facultyRoutes = require('./admin/faculties');
const studentRoutes = require('./admin/students');
const courseRoutes = require('./admin/courses');
const inquiryRouters = require('./admin/inquiries');

router.use('/faculty',facultyRoutes);
router.use('/student',studentRoutes);
router.use('/course',courseRoutes);
router.use('/inquiry',inquiryRouters);

router.post('/login',function(req,res,next){
    Admin.find({admin_email:req.body.admin_email})
       .exec()
       .then(data => {
           if(!data.length){
               return res.status(404).json({
                   message: 'User not found'
               });
           }
           else{
            bcrypt.compare(req.body.admin_password,data[0].admin_password,(err,result)=>{
               if(err) {
                       return res.status(401).json({
                            message: 'Invalid email or password'
                        });
                   }
                   if(result){
                       const token = jwt.sign(
                           {
                               admin_email:data[0].admin_email,
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


router.post('/add', (req, res, next) =>{
    bcrypt.hash(req.body.admin_password, 10,(err,hash)=> {
        if(err) {
            res.status(500).json(err);
        }
        else{
            const admin = new Admin({
                _id: new mongoose.Types.ObjectId(),
                admin_email: req.body.admin_email,
                admin_password: hash,
            });

            admin.save().then(result => {
                res.status(201).json({
                    message: "Data Inserted Successfully!",
                    data: result
                });
            })
                .catch(err => res.status(500).json({
                    message: "Something went wrong",
                    error: err
                }));

        }
    });
});

module.exports = router;