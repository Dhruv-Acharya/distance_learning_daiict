const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const FcTest = require('./../../models/FcTest');
const FcTestQuestion = require('./../../models/FcTestQuestion');

router.post('/create', (req, res, next) => {
    let quetionArray = [];
    for(que in req.body.FcTest_questions) {
        const question = new FcTestQuestion({
            _id : new mongoose.Schema.ObjectId(),
            FcTestQuestion_text : req.body.FcTestQuestion_text,
            FcTestQuestion_type : req.body.FcTestQuestion_type,
            FcTestQuestion_answers : req.body.FcTestQuestion_answers,
            FcTestQuestion_answer : req.body.FcTestQuestion_answer
        });
        quetionArray.push(question._id);
    }
});

module.exports = router;