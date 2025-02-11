'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

export default function AddressForm() {
  const [addresses, setAddresses] = useState([]);
  const [currentAddress, setCurrentAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    const token = localStorage.getItem('token');
    setError(null);
    
    try {
      const response = await axios.get('http://localhost:3000/users/addresses', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Ensure we're setting an array
      const addressData = response.data?.addresses || response.data || [];
      setAddresses(Array.isArray(addressData) ? addressData : []);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      setError('Failed to load addresses. Please try again later.');
      setAddresses([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    setError(null);
    
    try {
      if (isEditing) {
        await axios.put(`http://localhost:3000/users/addresses/${editingId}`, currentAddress, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } else {
        await axios.post('http://localhost:3000/users/addresses', currentAddress, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
      await fetchAddresses();
      setCurrentAddress({ street: "", city: "", state: "", zipCode: "", country: "" });
      setIsEditing(false);
      setEditingId(null);
    } catch (error) {
      console.error('Error saving address:', error);
      setError('Failed to save address. Please try again.');
    }
  };

  const handleEdit = (address) => {
    setCurrentAddress(address);
    setIsEditing(true);
    setEditingId(address._id);
  };

  const handleDelete = async (addressId) => {
    const token = localStorage.getItem('token');
    setError(null);
    
    try {
      await axios.delete(`http://localhost:3000/users/addresses/${addressId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      await fetchAddresses();
    } catch (error) {
      console.error('Error deleting address:', error);
      setError('Failed to delete address. Please try again.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="pb-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">Shipping Addresses</h2>
        <p className="mt-2 text-gray-500">Manage your shipping addresses</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
          <input
            type="text"
            name="street"
            value={currentAddress.street}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black transition-colors duration-200"
            placeholder="Enter your street address"
            required
          />
        </motion.div>

        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
            <input
              type="text"
              name="city"
              value={currentAddress.city}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black transition-colors duration-200"
              placeholder="Enter your city"
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
            <input
              type="text"
              name="state"
              value={currentAddress.state}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black transition-colors duration-200"
              placeholder="Enter your state"
              required
            />
          </motion.div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
            <input
              type="text"
              name="zipCode"
              value={currentAddress.zipCode}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black transition-colors duration-200"
              placeholder="Enter your ZIP code"
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
            <input
              type="text"
              name="country"
              value={currentAddress.country}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black transition-colors duration-200"
              placeholder="Enter your country"
              required
            />
          </motion.div>
        </div>

        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <button
            type="submit"
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
          >
            {isEditing ? 'Update Address' : 'Add Address'}
          </button>
        </motion.div>
      </form>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Your Addresses</h3>
        {Array.isArray(addresses) && addresses.length > 0 ? (
          addresses.map((address) => (
            <div key={address._id} className="bg-gray-50 p-4 rounded-lg mb-4 flex justify-between items-center">
              <div>
                <p>{address.street}</p>
                <p>{`${address.city}, ${address.state} ${address.zipCode}`}</p>
                <p>{address.country}</p>
              </div>
              <div>
                <button
                  onClick={() => handleEdit(address)}
                  className="text-blue-600 hover:text-blue-800 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(address._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No addresses found. Add your first address above.</p>
        )}
      </div>
    </div>
  );
}