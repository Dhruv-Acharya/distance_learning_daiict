const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
require('./env');

const adminRoutes = require('./api/routes/admin');
const taRoutes = require('./api/routes/teachingAssistant/teachingAssistants');

const app = express();
mongoose.connect('mongodb://Dhruv:'+process.env.MONGO_ATLAS_PASSWORD+'@practice-shard-00-00-qh5e1.mongodb.net:27017,practice-shard-00-01-qh5e1.mongodb.net:27017,practice-shard-00-02-qh5e1.mongodb.net:27017/test?ssl=true&replicaSet=practice-shard-0&authSource=admin');

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

app.use(cors());

app.use('/admin',adminRoutes);
//app.use('/student', studentRoutes);
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