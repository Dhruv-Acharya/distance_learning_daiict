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
            console.log("Bhoot");
            let std_id_arr = [];
            let std_name_arr = [];
            let x = 0;
            let flag = false;
            const result_final = [];
            for (let i=0; i<result.length; i++){
                std_id_arr.push(result[i].student_id);
            }
            for (j = 0; j < std_id_arr.length; j++) { //do not use $in
                Student.find({_id : std_id_arr[j]}).exec()
                    .then(result_name =>{
                        console.log("Hello");
                        //std_name_arr.push(result_name[0].student_name);
                        result_final.push({
                            _id : result[0]._id,
                            student_name : result_name[0].student_name,
                            complaint_date_posted : result[0].complaint_date_posted,
                            complaint_title : result[0].complaint_title,
                            complaint_description : result[0].complaint_description
                        });
                        x++;
                        console.log(flag+" "+x + " "+ std_name_arr.length);
                        if(x>=std_name_arr.length){
                            flag = true;
                            console.log(flag+" "+x + " "+ std_name_arr.length);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json(err);
                    });
            }
            while (flag === false) {
            }
            console.log(result_final);
            /*while(x<std_name_arr.length){
                console.log(232);
            }
            /*
            Student.find({_id : {$in : std_id_arr}}).exec().then(student_name_temp => {*/
            /*console.log(std_name_arr);

                let i;
                for(i=0; i<result.length; i++) {

                }
                while(i<result.length){

                }
            //console.log(result_final);*/


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