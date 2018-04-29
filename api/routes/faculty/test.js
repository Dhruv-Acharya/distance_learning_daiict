const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const FcTest = require('./../../models/FcTest');
const FcTestQuestion = require('./../../models/FcTestQuestion');

router.post('/create/:FC_id', (req, res, next) => {
    let questionArray = [];
    var count=0;
    var fctestque = JSON.parse(req.body.FcTest_questions);
    for(que in fctestque) {
        
        const question = new FcTestQuestion({
            _id : new mongoose.Types.ObjectId(),
            FcTestQuestion_text : fctestque[que].FcTestQuestion_text,
            FcTestQuestion_type : fctestque[que].FcTestQuestion_type,
            FcTestQuestion_answers : fctestque[que].FcTestQuestion_answers,
            FcTestQuestion_answer : fctestque[que].FcTestQuestion_answer
        });
        question.save()
            .then(data=>{
                questionArray.push(data._id);
                count++;
                if(count===fctestque.length)
                {
                    fctest = new FcTest({
                        _id: new mongoose.Types.ObjectId(),
                        FC_id : req.params.FC_id,
                        FcTest_questions : questionArray
                    });
                    fctest.save().then(data=>{
                        res.status(200).json({message: "the test creation was successful"});
                    }).catch(err=>{
                        res.status(500).json({error : err, message : "Try something better next time"});
                    });
                }
            })
            .catch(err => {
                res.json(500).json({
                message: "the test creation was not successful"
            });
    });
}
    console.log(questionArray);
});

router.patch('/update/:FcTest_id', (req, res, next) => {
    let questionArray = [];
    var count=0;
    var fctestque = JSON.parse(req.body.FcTest_questions);
    for(que in fctestque) {
        
        const question = new FcTestQuestion({
            _id : new mongoose.Schema.ObjectId(),
            FcTestQuestion_text : fctestque[que].FcTestQuestion_text,
            FcTestQuestion_type : fctestque[que].FcTestQuestion_type,
            FcTestQuestion_answers : fctestque[que].FcTestQuestion_answers,
            FcTestQuestion_answer : fctestque[que].FcTestQuestion_answer
        });
        question.save()
            .then(data=>{
                questionArray.push(data._id);
                count++;
                if(count===fctestque.length)
                {
                    FcTest.update({_id : req.params.FcTest_id},{$set : {
                        FcTest_questions : questionArray
                    }}).then(data=>{
                        res.status(200).json({message: "the test was updated successful"});
                    }).catch(err=>{
                        res.status(500).json({error : err, message : "Try something better next time"});
                    });
                }
            })
            .catch(err => {
                res.json(500).json({
                message: "the test updation was not successful"
            });
    });
}
    console.log(questionArray);
});

module.exports = router;