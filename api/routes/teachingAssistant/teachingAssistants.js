const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const Teaching_Assistant = require('../../models/teachingAssistant');

// Signup
router.post('/add',(req, res, next) =>{
    Teaching_Assistant.find({TA_email:req.body.TA_email})
        .exec()
        .then(TA => {
            if(TA.length>=1){
                res.status(409).json({
                    message: 'Email already existed, try different email'
                });
            }else{
                bcrypt.hash(req.body.TA_password,10,(err,hash)=> {
                    if(err) {
                        return res.status(500).json({
                            error:err
                        });
                    }else{
                        const TA= new Teaching_Assistant({
                            _id:new mongoose.Types.ObjectId(),
                            TA_name : req.body.TA_name,
                            TA_email:req.body.TA_email,
                            TA_password: hash
                        });
                        TA.save()
                            .then(result=>{
                                console.log(result);
                                res.status(201).json({
                                    message: 'User created'
                                });
                            })
                            .catch(err=>{
                                console.log(err);
                                res.status(500).json({
                                    error:err
                                });
                            });
                    }
                });
            }
        })


});

// Login
router.post('/login',(req,res,next)=>{
   Teaching_Assistant.find({TA_email:req.body.TA_email})
       .exec()
       .then(TA => {
           if(TA.length<1){
               return res.status(401).json({
                   message: 'Email doesn\'t exist, please enter valid email'
               });
           }
           bcrypt.compare(req.body.TA_password,TA[0].TA_password,(err,result)=>{
                if(err) {
                    return res.status(401).json({
                        message: 'Email or password incorrect'
                    });
                }
                if(result){
                    const token = jwt.sign(
                        {
                            TA_email:TA[0].TA_email,
                            TA_id:TA[0]._id
                        },
                        "secret",
                        {
                            expiresIn:'1h'
                        }
                    );
                    return  res.status(200).json({
                        message:'Login successful',
                        token:token
                    });
                }
               res.status(401).json({
                   message: 'Email doesn\'t exist, please enter valid email'
               });
           });

       })
       .catch(err=>{
           console.log(err);
           res.status(500).json({
               error:err
           });
       });
});

// Delete
router.delete('/delete/:TA_id',(req,res,next)=>{
    Teaching_Assistant.remove({_id:req.params.TA_id})
        .exec()
        .then(result=>{
            res.status(200).json({
                message: 'User successfully deleted'
            });
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error:err
            });
        });
});

// Edit Profile
router.patch('/update/:TAID',(req, res, next) => {
    const TAID = req.params.TAID;
    Teaching_Assistant.update({_id: TAID},{$set: {TA_id: req.body.TA_id,
        TA_name: req.body.TA_name,
        TA_photo: req.body.TA_photo,
        TA_email: req.body.TA_email,
        TA_password: req.body.TA_password,
        TA_contact_number: req.body.TA_contact_number,
        TA_educational_details: req.body.TA_educational_details
        } })
        .exec()
        .then(result=>{
            res.status(200).json({
                message: 'User Profile updated successfully'
            });
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error:err
            });
        });
});

module.exports = router;