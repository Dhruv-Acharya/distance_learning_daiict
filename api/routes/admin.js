const express = require('express');
const router = express.Router();
const Admin = require('../models/admin');
const facultyRoutes = require('./admin/faculties');
const studentRoutes = require('./admin/students');
var bcrypt = require('bcrypt');
router.use('/faculty',facultyRoutes);
router.use('/student',studentRoutes);
router.post('/login',function(req,res,next){
         Admin.find({admin_Email:req.body.admin_Email})
            .exec()
            .then(data => {
                if(!data.length){
                    return res.status(404).json({
                        message: 'User not found'
                    });
                }
                else{
                 bcrypt.compare(req.body.admin_Password,data[0].admin_Password,(err,result)=>{
                    if(err) {
                            return res.status(401).json({
                                 message: 'Invalid email or password'
                             });
                        }
                        if(result){
                        res.status(200).json(data);
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