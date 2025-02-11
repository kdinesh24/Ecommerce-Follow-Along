const User = require('../models/user.model');

exports.addAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const newAddress = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.addresses.push(newAddress);
    await user.save();

    res.status(201).json({ message: 'Address added successfully', address: newAddress });
  } catch (error) {
    res.status(500).json({ message: 'Error adding address', error: error.message });
  }
};

exports.getAddresses = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ addresses: user.addresses });
  } catch (error) {
    console.error('Error fetching addresses:', error);
    res.status(500).json({ message: 'Error fetching addresses', error: error.message });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.addressId;
    const updatedAddress = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);
    if (addressIndex === -1) {
      return res.status(404).json({ message: 'Address not found' });
    }

    user.addresses[addressIndex] = { ...user.addresses[addressIndex].toObject(), ...updatedAddress };
    await user.save();

    res.status(200).json({ message: 'Address updated successfully', address: user.addresses[addressIndex] });
  } catch (error) {
    res.status(500).json({ message: 'Error updating address', error: error.message });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.addressId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.addresses = user.addresses.filter(addr => addr._id.toString() !== addressId);
    await user.save();

    res.status(200).json({ message: 'Address deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting address', error: error.message });
  }
};