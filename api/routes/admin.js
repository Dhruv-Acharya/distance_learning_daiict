const express = require('express');
const router = express.Router();
const Admin = require('../models/admin');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const async=require('async');
const nodemailer=require('nodemailer');
const smtpTransport=require('nodemailer-smtp-transport');
const crypto=require('crypto');
require('./../../env');

const facultyRoutes = require('./admin/faculties');
const studentRoutes = require('./admin/students');
const courseRoutes = require('./admin/courses');
const complaintRoutes = require('./admin/complaints');
const inquiryRoutes = require('./admin/inquiries');

router.use('/faculty',facultyRoutes);
router.use('/student',studentRoutes);
router.use('/course',courseRoutes);
router.use('/inquiry',inquiryRoutes);
router.use('/complain',complaintRoutes)

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
               });
           }
       }).catch(err=>{
           res.status(500).json({
               error:err
           });
        });
});


router.post('/add', (req, res, next) =>{
    bcrypt.hash(req.body.admin_password, process.env.BCRYPT_KEY,(err,hash)=> {
        if(err) {
            console.log(req.body.admin_password);
            res.status(500).json({
                error: err,
                hash: hash
            });
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

// Forgot Password
router.post('/forgotpassword', function (req, res, next) {
    async.waterfall([
        function (done) {
            crypto.randomBytes(20, function (err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function (token, done) {
            Admin.findOne({admin_email: req.body.admin_email}, function (err, user) {
                if (!Admin) {
                    req.flash('Error', 'No account with that email address exists');
                    return res.redirect('/forgotpassword');
                }
                user.admin_resetPasswordToken = token;
                user.admin_resetPasswordExpires = Date.now() + 7200000;
                user.save(function (err) {
                    done(err, token, user);
                });
            });
        },
        function (token, user, done) {
            var transport = nodemailer.createTransport(smtpTransport({
                host: 'localhost',
                port: 3000,
                secure: 'false',
                service: 'Gmail',
                auth: {
                    user: 'team11novice@gmail.com',
                    pass: process.env.GMAILPW
                },
                tls: {
                    rejectUnauthorized: false
                }
            }));
            var mailOptions = {
                to: user.admin_email,
                from: 'team11novice@gmail.com',
                subject: 'Node.js Password Reset',
                text: 'You are receiving this because you have requested the reset  os the password' +
                ' Please click on the following link, or paste this into your browser to complete the process\n ' +
                'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                'If you did not request this, please ignore this email and your password will remail unchanged'
            };
            transport.sendMail(mailOptions, function (err) {
                console.log('Mail Sent');
                console.log('Success An email has been set to ' + user.admin_email + ' with further instructions.');
                done(err, 'done');
            });
        }
    ], function (err) {
        if (err) return next(err);
        res.redirect('/forgotpassword');
    });
});
//reset Password
router.post('/reset',function(req,res){
    async.waterfall([
        function(done){
            Admin.findOne({admin_resetPasswordToken:req.body.token,admin_resetPasswordExpires:{$gt:Date.now()}},function(err,user){
                if(!user){
                    console.log('error..Password reset token is invalid or has expired.');
                    return res.redirect('back');
                }
                if(req.body.password===req.body.confirmpassword){
                    user.admin_password=req.body.password;
                    bcrypt.hash(user.admin_password,10,(err,hash)=> {
                        //console.log(user.ta_password);
                        if (err) {
                            return res.status(500).json({
                                error: err
                            });
                        } else {
                            user.admin_password=hash;
                            admin_email=user.admin_email;
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
                                'This is a confirmation that the password for your account '+user.admin_email+'has been changed.\n'
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

module.exports = router;