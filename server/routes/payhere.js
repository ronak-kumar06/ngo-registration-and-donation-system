const express = require('express');
const router = express.Router();
const { createPayherePayment, payhereNotify, dismissPayherePayment } = require('../controllers/payhereController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create', protect, createPayherePayment);
router.post('/notify', payhereNotify);
router.post('/dismiss', protect, dismissPayherePayment);

module.exports = router;
