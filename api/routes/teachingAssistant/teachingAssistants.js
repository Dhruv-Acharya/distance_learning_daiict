const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const multer=require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/teachingassistant');
    },
    filename: function(req, file, cb){
        let type;
        if(file.mimetype === "image/jpeg") {
            type = ".jpg";
        }
        cb(null, req.body.ta_id+type);
    }
});

const upload = multer({storage:storage});
const Teaching_Assistant = require('../../models/teachingAssistant');

// Signup
router.post('/signup',upload.single('ta_photo'),(req, res, next) =>{
    //console.log(req.file);
    Teaching_Assistant.find({ta_email:req.body.ta_email})
        .exec()
        .then(TA => {
            if(TA.length>=1){
                res.status(409).json({
                    message: 'Email already existed, try different email'
                });
            }else{
                bcrypt.hash(req.body.ta_password,10,(err,hash)=> {
                    if(err) {
                        return res.status(500).json({
                            error:err
                        });
                    }else{
                        const TA= new Teaching_Assistant({
                            _id:new mongoose.Types.ObjectId(),
                            ta_email:req.body.ta_email,
                            ta_password: hash
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
                Teaching_Assistant.ta_resetPasswordToken=token;
                Teaching_Assistant.ta_resetPasswordExpires=Date.now()+3600000;

                Teaching_Assistant.save(function(err){
                    done(err,token,user);
                });
            });
        },
        function(token,user,done){
            var smtpTransport=nodemailer.createTransport({
                service:'Gmail',
                auth:{
                    user:'team11novice@gmail.com',
                    pass:process.env.GMAILPW
                }
            });
            var mailOptions={
                to: user.ta_email,
                from: 'no-reply@gmail.com',
                subject: 'Node.js Password Reset',
                text: 'You are receiving this because you have requested the reset  os the password'+
                'Please click on the following link, or paste this into your browser to complete the process'+
                'http://'+req.headers.host+'/reset/'+token+'\n\n'+
                'If you did not request this, please ignore this email and your password will remail unchanged'
            };
            smtpTransport.sendMail(mailOptions,function(err){
                console.log('Mail Sent');
                req.flash('Success','An email has been set to '+user.ta_email+ ' with further instructions.');
                done(err,'done');
            });
        }
    ],function(err){
        if(err) return next(err);
        res.redirect('/forgotpassword');
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