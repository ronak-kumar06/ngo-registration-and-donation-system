const User = require('../models/User');
const Donation = require('../models/Donation');

const listUsers = async (req, res) => {
  const users = await User.find().select('name email phone role createdAt').sort({ createdAt: -1 });
  res.json(users);
};

const listDonations = async (req, res) => {
  const donations = await Donation.find().populate('user', 'name email').sort({ transactionDate: -1 });
  res.json(donations);
};

module.exports = {
  listUsers,
  listDonations,
};
