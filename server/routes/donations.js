const express = require('express');
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  getMyDonations,
  getAllDonations,
  exportDonations,
  markFailed
} = require('../controllers/donationController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/create-order', protect, createOrder);
router.post('/verify-payment', protect, verifyPayment);
router.post('/mark-failed', protect, markFailed);
router.get('/my', protect, getMyDonations);
router.get('/all', protect, admin, getAllDonations);
router.get('/export', protect, exportDonations);

module.exports = router;
