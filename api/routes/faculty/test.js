const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const FcTest = require('./../../models/FcTest');
const FcTestQuestion = require('./../../models/FcTestQuestion');

router.post('/create', (req, res, next) => {
    let quetionArray = [];
    for(que in req.body.FcTest_questions) {
        console.log(req.body.FcTest_questions[que]);
        const question = new FcTestQuestion({
            _id : new mongoose.Schema.ObjectId(),
            FcTestQuestion_text : req.body.FcTest_questions[que].FcTestQuestion_text,
            FcTestQuestion_type : req.body.FcTest_questions[que].FcTestQuestion_type,
            FcTestQuestion_answers : req.body.FcTest_questions[que].FcTestQuestion_answers,
            FcTestQuestion_answer : req.body.FcTest_questions[que].FcTestQuestion_answer
        });
        question.save()
            .then(quetionArray.push(question._id))
            .catch(err => {err});
    }
    console.log(quetionArray);
});

module.exports = router;