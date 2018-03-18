const express = require('express');
const router = express.Router();

const facultyRoutes = require('./admin/faculties');

router.use('/faculty',facultyRoutes);

module.exports = router;