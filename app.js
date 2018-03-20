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

app.use('/admin',adminRoutes);
app.use('/ta',taRoutes);

module.exports = app;

//h9yjnQ5YRTvbIpyO