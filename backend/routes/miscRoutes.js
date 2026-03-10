const express = require('express');
const router = express.Router();
const { scheduleVisit, getDashboardStats } = require('../controllers/miscController');

router.post('/visits', scheduleVisit);
router.get('/dashboard', getDashboardStats);

module.exports = router;
