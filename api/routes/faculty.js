const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Faculty = require('../models/faculty');
const courseRoutes = require('./faculty/courses');
const testRoutes = require('./faculty/test');
const multer = require('multer');

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

router.post('/login',function(req,res,next){
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

router.patch('/update/:faculty_id', upload.single('faculty_photo'), (req, res, next) => {
            
            Faculty.update({_id: req.params.faculty_id}, {$set: {
                faculty_name: req.body.faculty_name,
                faculty_photo: "https://sheltered-spire-10162.herokuapp.com" + req.file.originalname,
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