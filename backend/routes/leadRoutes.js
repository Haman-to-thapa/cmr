const express = require('express');
const router = express.Router();
const { captureLead, updateLeadStatus, getLeads, getLeadById } = require('../controllers/leadController');

router.post('/', captureLead);
router.patch('/:id/status', updateLeadStatus);
router.get('/', getLeads);
router.get('/:id', getLeadById);

module.exports = router;
