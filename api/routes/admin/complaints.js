const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Student = require('./../../models/student');
const Complaint = require('../../models/complaint');
const checkAuth = require('./../../middleware/check-auth');

router.get('/view', function (req, res, next) {
    Complaint.find()
        .exec()
        .then(result => {
            let std_id_arr = [];
            let std_name_arr = [];
            let j = 0;
            for (let i=0; i<result.length; i++){
                std_id_arr.push(result[i].student_id);
            }
            for (j = 0; j < std_id_arr.length; j++) {
                Student.find({_id : std_id_arr[j]}).exec()
                    .then(result_name =>{
                        std_name_arr.push(result_name[0].student_name)
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json(err);
                    });
            }
            /*
            Student.find({_id : {$in : std_id_arr}}).exec().then(student_name_temp => {*/
                const result_final = [];
                let i;
                for(i=0; i<result.length; i++) {
                    result_final.push({
                        _id : result[i]._id,
                        student_name : std_name_arr[i],
                        complaint_date_posted : result[i].complaint_date_posted,
                        complaint_title : result[i].complaint_title,
                        complaint_description : result[i].complaint_description
                    });
                }
                while(i<result.length){

                }
                res.status(200).json(result_final);
                console.log(result_final);
            /*})
                .catch(err => {
                    console.log(err);
                    res.status(500).json(err);
                });*/
            /*console.log(s
}tudent_name_temp);
            if (!result.length) {
                res.status(404).json({err: "No entries found"});
            }
            else res.status(200).json({
                student_name : student_name_temp.student_name,
                complaint_date_posted : result.complaint_date_posted,
                complaint_title : result.complaint_title,
                complaint_description : result.complaint_description
            });*/
        }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.patch('/respond/:complaint_id', checkAuth, function (req, res, next) {
    Complaint.update({complaint_id: req.params.complaint_id}, {
        $set: {
            complaint_response: req.body.complaint_response
        }

    }).exec().then(result => {
        res.status(200).json(result);
    }).catch(err => {
        res.status(500).json({
            error: err
        });
    });

});
module.exports = router;