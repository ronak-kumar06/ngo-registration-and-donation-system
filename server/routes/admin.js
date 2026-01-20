const express = require('express');
const router = express.Router();
const { listUsers, listDonations } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/users', protect, admin, listUsers);
router.get('/donations', protect, admin, listDonations);

module.exports = router;
