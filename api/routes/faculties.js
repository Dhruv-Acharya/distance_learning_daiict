const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Faculty = require('../models/faculty');


router.post('/faculty',(req, res, next) =>{
    console.log(req.body);
    const faculty = new Faculty({
        _id: new mongoose.Types.ObjectId(),
        faculty_id: req.body.faculty_id,
        faculty_name: req.body.faculty_name,
        faculty_photo: req.body.faculty_photo,
        faculty_email: req.body.faculty_email,
        faculty_password: req.body.faculty_password,
        faculty_contact_number: req.body.faculty_contact_number,
        faculty_educational_details: req.body.faculty_educational_details
    });

    faculty.save().then(result => {
        res.status(201).json(result);
    })
        .catch(err => res.status(500).json(err));
});

module.exports = router;