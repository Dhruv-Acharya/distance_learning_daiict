const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const adminRoutes = require('./api/routes/admin');
const taRoutes = require('./api/routes/teachingAssistant/teachingAssistants');

const app = express();
mongoose.connect('mongodb://Dhruv:h9yjnQ5YRTvbIpyO@practice-shard-00-00-qh5e1.mongodb.net:27017,practice-shard-00-01-qh5e1.mongodb.net:27017,practice-shard-00-02-qh5e1.mongodb.net:27017/test?ssl=true&replicaSet=practice-shard-0&authSource=admin');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if(res.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods','PUT, POST, GET, PATCH, DELETE');
        return res.status(200).json({});
    }
});

app.use('/admin',adminRoutes);
app.use('/ta',taRoutes);


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