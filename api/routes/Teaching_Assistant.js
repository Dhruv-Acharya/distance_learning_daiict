const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Teaching_Assistant = require('../models/Teaching_Assistant');


router.post('/TA',(req, res, next) =>{
    console.log(req.body);
const TA = new Teaching_Assistant({
    _id: new mongoose.Types.ObjectId(),
    TA_id: req.body.TA_id,
    TA_name: req.body.TA_name,
    TA_photo: req.body.TA_photo,
    TA_email: req.body.TA_email,
    TA_password: req.body.TA_password,
    TA_contact_number: req.body.TA_contact_number,
    TA_educational_details: req.body.TA_educational_details
});

TA.save().then(result => {
    res.status(201).json(result);
    })
    .catch(err => res.status(500).json(err));
});

module.exports = router;