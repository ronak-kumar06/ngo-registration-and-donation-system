const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  provider: {
    type: String,
    enum: ['razorpay', 'payhere'],
    default: 'razorpay'
  },
  amount: {
    type: Number,
    required: [true, 'Please add a donation amount']
  },
  currency: {
    type: String,
    default: 'INR'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'success', 'failed'],
    default: 'pending'
  },
  razorpayOrderId: {
    type: String
  },
  razorpayPaymentId: {
    type: String
  },
  payhereOrderId: {
    type: String
  },
  transactionDate: {
    type: Date,
    default: Date.now
  },
  campaign: {
    type: String,
    default: 'General Fund'
  }
});

module.exports = mongoose.model('Donation', donationSchema);
