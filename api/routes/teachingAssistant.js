const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const multer=require('multer');
const async=require('async');
const nodemailer=require('nodemailer');
const smtpTransport=require('nodemailer-smtp-transport');
const crypto=require('crypto');
const checkAuth = require('./../middleware/check-auth');
require('./../../env');

const evaluationRoutes = require('./teachingAssistant/evaluations');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/teachingAssistant');
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
const Teaching_Assistant = require('../models/teachingAssistant');

router.use('/evaluation',evaluationRoutes);

//add TA
router.post('/add', (req, res, next) => {
    console.log(req.body);
    bcrypt.hash(req.body.ta_password, 10, (err, hash) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                error : err
            });
        }
        else {
            const TA = new Teaching_Assistant({
                _id: new mongoose.Types.ObjectId(),
                ta_name: req.body.ta_name,
                //ta_photo: req.file.path,
                ta_email: req.body.ta_email,
                ta_password: hash,
                ta_contact_number: req.body.ta_contact_number
            });
            console.log(TA);

            TA.save().then(result => {
                res.status(201).json({
                    message: "Data Inserted Successfully!",
                    data: result
                });
            })
                .catch(err =>{
                    res.status(500).json({
                    message: "Something went wrong",
                    error: err
                })});
        }
    });
});

//get TA info
router.get('/view', checkAuth, (req, res,next)=>{
    Teaching_Assistant.find({_id : req.userData.ta_id}).then(data=>{
        res.status(200).json({data});
    }).catch(err=>{
       res.status(500).json({error : err});
    });
});

//update TA
router.patch('/update',checkAuth, upload.single('ta_photo') , (req, res, next) => {
            Teaching_Assistant.update({_id : req.userData.ta_id}, {$set : {
                    ta_name: req.body.ta_name,
                    ta_photo: "http://192.168.137.1:3000/uploads/teachingAssistant/" + req.file.originalname,
                    ta_email: req.body.ta_email,
                    ta_contact_number: req.body.ta_contact_number,
                    ta_educational_details: req.body.ta_educational_details
                }}).then(result => {
                res.status(200).json({
                    message: "Data updated Successfully!",
                    data: result
                });
            })
                .catch(err =>{
                    console.log(err);
                    res.status(500).json({
                        message: "Something went wrong",
                        error: err
                    })});
});

// Login
router.post('/login',(req,res,next)=>{
    Teaching_Assistant.find({ta_email:req.body.ta_email})
        .exec()
        .then(TA => {
            if(TA.length<1){
                return res.status(401).json({
                    message: 'Email doesn\'t exist, please enter valid email'
                });
            }
            bcrypt.compare(req.body.ta_password,TA[0].ta_password,(err,result)=>{
                if(err) {
                    return res.status(401).json({
                        message: 'Email or password incorrect'
                    });
                }
                if(result){
                    const token = jwt.sign(
                        {
                            ta_email:TA[0].ta_email,
                            ta_id:TA[0]._id
                        },
                        process.env.JWT_KEY,
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

// Forgot Password
router.post('/forgotpassword',function(req,res,next){
    async.waterfall([
        function(done){
            crypto.randomBytes(20,function(err,buf){
                var token = buf.toString('hex');
                done(err,token);
            });
        },
        function(token,done){
            Teaching_Assistant.findOne({ta_email:req.body.ta_email},function(err,user){
                if(!Teaching_Assistant){
                    req.flash('Error','No account with that email address exists');
                    return res.redirect('/forgotpassword');
                }
                user.ta_resetPasswordToken=token;
                user.ta_resetPasswordExpires=Date.now()+7200000;
                user.save(function(err){
                    done(err,token,user);
                });
            });
        },
        function(token,user,done){
            var transport=nodemailer.createTransport(smtpTransport({
                host:'localhost',
                port:3000,
                secure:'false',
                service:'Gmail',
                auth:{
                    user:'team11novice@gmail.com',
                    pass:process.env.GMAILPW
                },
                tls:{
                    rejectUnauthorized:false
                }
            }));
            var mailOptions={
                to: user.ta_email,
                from: 'team11novice@gmail.com',
                subject: 'Node.js Password Reset',
                text: 'You are receiving this because you have requested the reset of the password'+
                ' Please click on the following link, or paste this into your browser to complete the process\n '+
                'http://'+req.headers.host+'/reset/'+token+'\n\n'+
                'If you did not request this, please ignore this email and your password will remail unchanged'
            };
            transport.sendMail(mailOptions,function(err){
                console.log('Mail Sent');
                console.log('Success An email has been set to '+user.ta_email+ ' with further instructions.');
                done(err,'done');
            });
        }
    ],function(err){
        if(err) return next(err);
        res.redirect('/forgotpassword');
    });
});
//reset Password
router.get('/reset/:token',function(req,res){
    console.log(req.params.token);
    Teaching_Assistant.findOne({ta_resetPasswordToken:req.params.token,ta_resetPasswordExpires:{$gt:Date.now()}},function(err,user){
        if(!user){
            console.log('error..Password reset token is invalid or has expired.');
            //return res.redirect('/forgotpassword');
        }
        console.log(req.params.token);
        //res.render('reset',{token:req.params.token});
    });
});
router.post('/reset/:token',function(req,res){
    async.waterfall([
        function(done){
            Teaching_Assistant.findOne({ta_resetPasswordToken:req.params.token,ta_resetPasswordExpires:{$gt:Date.now()}},function(err,user){
                if(!user){
                    console.log('error..Password reset token is invalid or has expired.');
                    return res.redirect('back');
                }
                if(req.body.password===req.body.confirmpassword){
                    user.ta_password=req.body.password;
                    bcrypt.hash(user.ta_password,10,(err,hash)=> {
                        //console.log(user.ta_password);
                        if (err) {
                            return res.status(500).json({
                                error: err
                            });
                        } else {
                            user.ta_password=hash;
                            ta_email=user.ta_email;
                            ta_name=user.ta_name;
                            ta_contact_number=user.ta_contact_number;
                            console.log(hash);

                            user.save()
                                .then(result => {
                                    console.log(result);
                                    res.status(201).json({
                                        message: 'your password has been changed'
                                    });
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.status(500).json({
                                        error: err
                                    });
                                });
                            var sendtransport=nodemailer.createTransport(smtpTransport({
                                host:'localhost',
                                port:3000,
                                secure:'false',
                                service:'Gmail',
                                auth:{
                                    user:'team11novice@gmail.com',
                                    pass:process.env.GMAILPW
                                },
                                tls:{
                                    rejectUnauthorized:false
                                }
                            }));
                            var mailOptions={
                                to:user.ta_email,
                                from:'team11novice@gmail.com',
                                subject:'Your password has been changed',
                                text:'Hello,\n\n'+
                                'This is a confirmation that the password for your account '+user.ta_email+'has been changed.\n'
                            };
                            sendtransport.sendMail(mailOptions,function(err){
                                console.log('Your password has been changed successfully');
                                done(err);
                            });

                        }

                    });
                    // user.ta_resetPasswordToken= undefined;
                    //user.ta_resetPasswordExpires=undefined;
                    user.save(function(err){
                        console.log(user);
                        console.log(err);
                    });

                }else{
                    console.log('error..Password do not match');
                    return res.redirect('back');
                }
            });
        },
        // (user,done)=>{
        //     var transport=nodemailer.createTransport(smtpTransport({
        //         host:'localhost',
        //         port:3000,
        //         secure:'false',
        //         service:'Gmail',
        //         auth:{
        //             user:'team11novice@gmail.com',
        //             pass:process.env.GMAILPW
        //         },
        //         tls:{
        //             rejectUnauthorized:false
        //         }
        //     }));
        //     var mailOptions={
        //         to:user.ta_email,
        //         from:'team11novice@gmail.com',
        //         subject:'Your password has been changed',
        //         text:'Hello,\n\n'+
        //              'This is a confirmation that the password for your account '+user.ta_email+'has been changed.\n'
        //     };
        //     transport.sendMail(mailOptions,function(err){
        //         console.log('Your password has been changed successfully');
        //         done(err);
        //     });
        // }
    ],function(err){
        //res.redirect('/login');
    });
});
// Logout
router.get('/logout',(req,res,next)=>{
    req.logout();
    req.flash("Sucess","See you later!");
    req.redirect('/login');
});

// Edit Profile
router.patch('/editprofile/:TAID',(req, res, next) => {

    const TAID = req.params.TAID;
    Teaching_Assistant.update({_id: TAID},{$set: {ta_id: req.body.ta_id,
            ta_name: req.body.ta_name,
            ta_photo: req.body.ta_photo,
            ta_email: req.body.ta_email,
            ta_password: req.body.ta_password,
            ta_contact_number: req.body.ta_contact_number,
            ta_educational_details: req.body.ta_educational_details
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