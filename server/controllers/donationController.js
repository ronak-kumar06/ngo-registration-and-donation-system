const Razorpay = require('razorpay');
const crypto = require('crypto');
const Donation = require('../models/Donation');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @desc    Create a donation order
// @route   POST /api/donations/create-order
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { amount, campaign } = req.body;

    // Mock for Test Mode (if keys are placeholders)
    if (process.env.RAZORPAY_KEY_ID.includes('placeholder')) {
        const mockId = `order_mock_${Date.now()}`;
        // Record pending donation immediately
        await Donation.create({
          user: req.user.id,
          provider: 'razorpay',
          amount: amount,
          currency: 'INR',
          paymentStatus: 'pending',
          razorpayOrderId: mockId,
          campaign: campaign || 'General Fund'
        });
        return res.json({
            id: mockId,
            amount: amount * 100,
            currency: 'INR',
            receipt: `receipt_${Date.now()}`
        });
    }

    const options = {
      amount: amount * 100, // Amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).send('Some error occured');
    }

  // Record pending donation immediately
  await Donation.create({
    user: req.user.id,
    provider: 'razorpay',
    amount: amount,
    currency: 'INR',
    paymentStatus: 'pending',
    razorpayOrderId: order.id,
    campaign: campaign || 'General Fund'
  });

    res.json(order);
  } catch (error) {
    res.status(500).send(error);
  }
};

// @desc    Verify payment and save donation
// @route   POST /api/donations/verify-payment
// @access  Private
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      campaign
    } = req.body;

    let isAuthentic = false;

    // Mock Verification for Test Mode
    if (razorpay_order_id.startsWith('order_mock_')) {
        isAuthentic = true;
    } else {
        const body = razorpay_order_id + '|' + razorpay_payment_id;

        const expectedSignature = crypto
          .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
          .update(body.toString())
          .digest('hex');

        isAuthentic = expectedSignature === razorpay_signature;
    }

    if (isAuthentic) {
    // Update existing pending donation to success
    const donation = await Donation.findOne({ user: req.user.id, razorpayOrderId: razorpay_order_id });
    if (donation) {
      donation.paymentStatus = 'success';
      donation.razorpayPaymentId = razorpay_payment_id;
      await donation.save();
    }

      res.json({
        message: 'Payment success',
      donationId: donation?._id
      });
    } else {
        // Log failed attempt if needed, but primarily return failure
      res.status(400).json({
        message: 'Payment verification failed'
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// @desc    Get logged in user's donations
// @route   GET /api/donations/my
// @access  Private
const getMyDonations = async (req, res) => {
  const donations = await Donation.find({ user: req.user.id }).sort({ transactionDate: -1 });
  res.json(donations);
};

// @desc    Get all donations (Admin)
// @route   GET /api/donations/all
// @access  Private/Admin
const getAllDonations = async (req, res) => {
    const donations = await Donation.find().populate('user', 'name email').sort({ transactionDate: -1 });
    res.json(donations);
};

const exportDonations = async (req, res) => {
  const donations = await Donation.find({ user: req.user.id }).sort({ transactionDate: -1 });
  const header = [
    'id',
    'campaign',
    'date',
    'amount',
    'currency',
    'status',
    'provider',
    'razorpay_payment_id',
    'razorpay_order_id',
    'payhere_order_id',
  ];
  const rows = donations.map((d) => [
    d._id,
    d.campaign,
    new Date(d.transactionDate).toISOString(),
    d.amount,
    d.currency || '',
    d.paymentStatus,
    d.provider || '',
    d.razorpayPaymentId || '',
    d.razorpayOrderId || '',
    d.payhereOrderId || '',
  ]);
  const csv = [header.join(','), ...rows.map((r) => r.join(','))].join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="receipts.csv"');
  res.send(csv);
};
// @desc    Mark Razorpay order as failed
// @route   POST /api/donations/mark-failed
// @access  Private
const markFailed = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;
    if (!razorpay_order_id) return res.status(400).json({ message: 'razorpay_order_id required' });
    const donation = await Donation.findOne({ user: req.user.id, razorpayOrderId: razorpay_order_id });
    if (!donation) return res.status(404).json({ message: 'Donation not found' });
    donation.paymentStatus = 'failed';
    await donation.save();
    res.json({ message: 'Marked as failed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getMyDonations,
  getAllDonations,
  exportDonations,
  markFailed
};
