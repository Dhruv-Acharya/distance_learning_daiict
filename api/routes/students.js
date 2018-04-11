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
/*
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/student');
    },
    filename: function(req, file, cb){
        let type;
        if(file.mimetype === "image/jpeg") {
            type = ".jpg";
        }
        cb(null, req.body.student_name+type);
    }
});

const upload = multer({storage:storage});*/
const Student = require('./../models/student');


//signup
router.post('/add', (req, res, next) => {
    bcrypt.hash(req.body.student_password, 10, (err, hash) => {
        if (err) {
            res.status(500).json(err);
        }
        else {
            const std = new Student({
                _id: new mongoose.Types.ObjectId(),
                student_name: req.body.student_name,
                student_email: req.body.student_email,
                student_password: hash,
                student_contact_number: req.body.student_contact_number,
            });

            std.save().then(result => {
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
    })
});

// Login
router.post('/login',(req,res,next)=>{
    Student.find({student_email:req.body.student_email})
        .exec()
        .then(std => {
            if(std.length<1){
                return res.status(401).json({
                    message: 'Email doesn\'t exist, please enter valid email'
                });
            }
            bcrypt.compare(req.body.student_password,std[0].student_password,(err,result)=>{
                if(err) {
                    return res.status(401).json({
                        message: 'Email or password incorrect'
                    });
                }
                if(result){
                    const token = jwt.sign(
                        {
                            student_email:std[0].student_email,
                            student_id:std[0]._id
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
router.delete('/delete/:student_id',(req,res,next)=>{
    Student.remove({_id:req.params.student_id})
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
            Student.findOne({student_email:req.body.student_email},function(err,user){
                if(!Student){
                    req.flash('Error','No account with that email address exists');
                    return res.redirect('/forgotpassword');
                }
                user.student_resetPasswordToken=token;
                user.student_resetPasswordExpires=Date.now()+7200000;
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
                to: user.student_email,
                from: 'team11novice@gmail.com',
                subject: 'Node.js Password Reset',
                text: 'You are receiving this because you have requested the reset  os the password'+
                ' Please click on the following link, or paste this into your browser to complete the process\n '+
                'http://'+req.headers.host+'/reset/'+token+'\n\n'+
                'If you did not request this, please ignore this email and your password will remail unchanged'
            };
            transport.sendMail(mailOptions,function(err){
                console.log('Mail Sent');
                console.log('Success An email has been set to '+user.student_email+ ' with further instructions.');
                done(err,'done');
            });
        }
    ],function(err){
        if(err) return next(err);
        res.redirect('/forgotpassword');
    });
});
router.get('/reset/:token',function(req,res){
    console.log(req.params.token);
    Student.findOne({student_resetPasswordToken:req.params.token,student_resetPasswordExpires:{$gt:Date.now()}},function(err,user){
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
            Student.findOne({student_resetPasswordToken:req.params.token,student_resetPasswordExpires:{$gt:Date.now()}},function(err,user){
                if(!user){
                    console.log('error..Password reset token is invalid or has expired.');
                    return res.redirect('back');
                }
                if(req.body.password===req.body.confirmpassword){
                    user.student_password=req.body.password;
                    bcrypt.hash(user.student_password,10,(err,hash)=> {
                        //console.log(user.ta_password);
                        if (err) {
                            return res.status(500).json({
                                error: err
                            });
                        } else {
                            user.student_password=hash;
                            student_email=user.student_email;
                            student_name=user.student_name;
                            student_contact_number=user.student_contact_number;
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
                                to:user.student_email,
                                from:'team11novice@gmail.com',
                                subject:'Your password has been changed',
                                text:'Hello,\n\n'+
                                'This is a confirmation that the password for your account '+user.student_email+'has been changed.\n'
                            };
                            sendtransport.sendMail(mailOptions,function(err){
                                console.log('Your password has been changed successfully');
                                done(err);
                            });

                        }

                    });
                    user.student_resetPasswordToken= undefined;
                    user.student_resetPasswordExpires=undefined;
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
router.patch('/editprofile/:StudentID',(req, res, next) => {

    const StudentID = req.params.StudentID;
    Student.update({_id: StudentID},{$set: {student_id: req.body.student_id,
        student_name: req.body.student_name,
        student_photo: req.body.student_photo,
        student_email: req.body.student_email,
        student_password: req.body.student_password,
        student_contact_number: req.body.student_contact_number,
        student_educational_details: req.body.student_educational_details
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