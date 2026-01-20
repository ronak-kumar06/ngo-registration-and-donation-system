const crypto = require('crypto');
const Donation = require('../models/Donation');

// Helper to format amount to 2 decimals as string
const formatAmount = (amount) => Number(amount).toFixed(2);

// @desc    Create PayHere payment data (hash computed server-side)
// @route   POST /api/payhere/create
// @access  Private
const createPayherePayment = async (req, res) => {
  try {
    const { amount, campaign } = req.body;
    const merchantId = process.env.PAYHERE_MERCHANT_ID;
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
    const currency = process.env.PAYHERE_CURRENCY || 'LKR';

    if (!merchantId || !merchantSecret) {
      console.warn('PayHere merchant config missing. Using demo placeholders and recording pending donation.');
      const DEMO_ID = '121XXXX';
      const DEMO_SECRET = 'DEMO_SECRET';
      const currency = process.env.PAYHERE_CURRENCY || 'LKR';
      const orderId = `PH_${Date.now()}_${(req.user.id || '').slice(-6)}`;
      const amtFormatted = formatAmount(amount);
      const demoHash = crypto
        .createHash('md5')
        .update(
          DEMO_ID +
            orderId +
            amtFormatted +
            currency +
            crypto.createHash('md5').update(DEMO_SECRET).digest('hex').toUpperCase()
        )
        .digest('hex')
        .toUpperCase();

      await Donation.create({
        user: req.user.id,
        provider: 'payhere',
        amount: Number(amount),
        currency,
        paymentStatus: 'pending',
        payhereOrderId: orderId,
        campaign: campaign || 'General Fund',
      });

      return res.status(200).json({
        merchant_id: DEMO_ID,
        order_id: orderId,
        amount: amtFormatted,
        currency,
        hash: demoHash,
        return_url: process.env.PAYHERE_RETURN_URL || undefined,
        cancel_url: process.env.PAYHERE_CANCEL_URL || undefined,
        notify_url: process.env.PAYHERE_NOTIFY_URL || undefined,
        items: campaign || 'Donation',
        first_name: req.user.name || 'Donor',
        last_name: '',
        email: req.user.email,
        phone: req.user.phone || '',
        address: '',
        city: '',
        country: 'Sri Lanka',
      });
    }

    const orderId = `PH_${Date.now()}_${(req.user.id || '').slice(-6)}`;
    const amtFormatted = formatAmount(amount);

    const hash = crypto
      .createHash('md5')
      .update(
        merchantId +
          orderId +
          amtFormatted +
          currency +
          crypto.createHash('md5').update(merchantSecret).digest('hex').toUpperCase()
      )
      .digest('hex')
      .toUpperCase();

    await Donation.create({
      user: req.user.id,
      provider: 'payhere',
      amount: Number(amount),
      currency,
      paymentStatus: 'pending',
      payhereOrderId: orderId,
      campaign: campaign || 'General Fund',
    });

    res.json({
      merchant_id: merchantId,
      order_id: orderId,
      amount: amtFormatted,
      currency,
      hash,
      // Return/cancel can be handled client-side routing
      return_url: process.env.PAYHERE_RETURN_URL || undefined,
      cancel_url: process.env.PAYHERE_CANCEL_URL || undefined,
      notify_url: process.env.PAYHERE_NOTIFY_URL || undefined,
      items: campaign || 'Donation',
      // Optional prefill
      first_name: req.user.name || 'Donor',
      last_name: '',
      email: req.user.email,
      phone: req.user.phone || '',
      address: '',
      city: '',
      country: 'Sri Lanka',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// @desc    PayHere notify callback - verify md5sig and update donation
// @route   POST /api/payhere/notify
// @access  Public (PayHere server)
const payhereNotify = async (req, res) => {
  try {
    const {
      merchant_id,
      order_id,
      payhere_amount,
      payhere_currency,
      status_code,
      md5sig,
    } = req.body;

    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
    if (!merchantSecret) {
      return res.status(500).send('PayHere merchant secret missing');
    }

    const computed = crypto
      .createHash('md5')
      .update(
        merchant_id +
          order_id +
          payhere_amount +
          payhere_currency +
          status_code +
          crypto.createHash('md5').update(merchantSecret).digest('hex').toUpperCase()
      )
      .digest('hex')
      .toUpperCase();

    if (computed !== md5sig) {
      return res.status(400).send('Invalid signature');
    }

    const donation = await Donation.findOne({ payhereOrderId: order_id });
    if (!donation) {
      return res.status(404).send('Donation not found');
    }

    let newStatus = donation.paymentStatus;
    // PayHere status codes: 2=Completed, 0=Pending, -1=Cancelled, -2=Failed, -3=Charged back
    if (String(status_code) === '2') newStatus = 'success';
    else if (String(status_code) === '0') newStatus = 'pending';
    else newStatus = 'failed';

    donation.paymentStatus = newStatus;
    await donation.save();

    res.status(200).send('OK');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

const dismissPayherePayment = async (req, res) => {
  try {
    const { order_id } = req.body;
    if (!order_id) return res.status(400).json({ message: 'order_id required' });
    const donation = await Donation.findOne({ payhereOrderId: order_id, user: req.user.id });
    if (!donation) return res.status(404).json({ message: 'Donation not found' });
    donation.paymentStatus = 'failed';
    await donation.save();
    res.json({ message: 'Marked as failed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { createPayherePayment, payhereNotify, dismissPayherePayment };
