const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkAuth = require('./../middleware/check-auth');

const Faculty = require('../models/faculty');

const courseRoutes = require('./faculty/courses');
const testRoutes = require('./faculty/test');
const evaluationRoutes = require('./faculty/evauations');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/faculty');
    },
    filename: function(req, file, cb){
        let type;
        if(file.mimetype === "image/jpeg") {
            type = ".jpg";
        }
        cb(null, req.body.ta_name+type);
    }
});

const upload = multer({storage:storage});

router.use('/course',courseRoutes);
router.use('/test',testRoutes);
router.use('/evaluation',evaluationRoutes);

router.post('/login',(req,res,next) => {
    Faculty.find({faculty_email:req.body.faculty_email})
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
                               faculty_id:data[0]._id,
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

router.get('/view', checkAuth, (req, res, next) => {
    Faculty.find({_id : req.userData.faculty_id})
        .exec()
        .then(result => {
            if(result.length >= 0){
                res.status(200).json(result);
            }else {
                res.status(404).json({
                    message: "No entries found for the ID!"
                });
            }
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

router.patch('/update/:faculty_id', checkAuth, upload.single('faculty_photo'), (req, res, next) => {
            
            Faculty.update({_id: req.params.faculty_id}, {$set: {
                faculty_name: req.body.faculty_name,
                faculty_photo: "http://192.168.137.1:3000/uploads/faculties/" + req.file.originalname,
                faculty_email: req.body.faculty_email,
                faculty_password: hash,
                faculty_contact_number: req.body.faculty_contact_number,
                faculty_educational_details: req.body.faculty_educational_details,
                faculty_area_interest: req.body.faculty_area_interest
            }})
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: 'faculty Profile updated successfully'
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
    
});

module.exports = router;