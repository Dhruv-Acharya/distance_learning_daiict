const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('./../../middleware/check-auth');
const bcrypt = require('bcrypt');
require('./../../../env');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/faculties');
    },
    filename: function(req, file, cb){
        let type;
        if(file.mimetype === "image/jpeg") {
            type = ".jpg";
        }
        cb(null, req.body.faculty_id+type);
    }
});
const upload = multer({storage: storage});

const Faculty = require('../../models/faculty');



router.post('/add', upload.single('faculty_photo'), (req, res, next) =>{
    bcrypt.hash(req.body.faculty_Password, process.env.BYCRYPT_KEY,(err,hash)=> {
    if(err) {
    res.status(500).json(err);
      } 
    else{
    const faculty = new Faculty({
        _id: new mongoose.Types.ObjectId(),
        faculty_id: req.body.faculty_id,
        faculty_name: req.body.faculty_name,
        faculty_photo: "https://sheltered-spire-10162.herokuapp.com/"+req.file.path,
        faculty_email: req.body.faculty_email,
        faculty_password: hash,
        faculty_contact_number: req.body.faculty_contact_number,
        faculty_educational_details: req.body.faculty_educational_details,
        faculty_area_interest: req.body.faculty_area_interest
    });
    
    faculty.save().then(result => {
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

router.get('/view', (req, res, next) => {
    Faculty.find()
        .exec()
        .then(result => {
            if(result.length >= 0){
                res.status(200).json(result);
            }else {
                res.status(404).json({
                    message: "No entries found!"
                });
            }
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

router.get('/view/:facultyID',(req, res, next) => {
    const facultyID = req.params.facultyID;
    Faculty.find({faculty_ID:facultyID})
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

router.delete('/remove/:facultyID',(req, res, next) => {
    const facultyID = req.params.facultyID;
    Faculty.remove({faculty_id: facultyID})
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

router.patch('/update/:facultyID',(req, res, next) => {
    bcrypt.hash(req.body.faculty_Password,10,(err,hash)=>{
        if(err)
        {
            res.status(500).json(err);
        }
        else
        {
            const facultyID = req.params.facultyID;
            Faculty.update({faculty_id: facultyID},{$set: {
                    faculty_name: req.body.faculty_name,
                    faculty_photo: req.body.faculty_photo,
                    faculty_email: req.body.faculty_email,
                    faculty_password: hash,
                    faculty_contact_number: req.body.faculty_contact_number,
                    faculty_educational_details: req.body.faculty_educational_details,
                    faculty_area_interest: req.body.faculty_area_interest} })
                .exec()
                .then(result => {
                        res.status(200).json(result);
                })
                .catch(err => {
                    res.status(500).json(err);
                });
        
        }
    });
});

module.exports = router;