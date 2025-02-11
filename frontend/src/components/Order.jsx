import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';

export default function Order() {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAddresses();
    fetchCart();
  }, []);

  const fetchAddresses = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:3000/users/addresses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAddresses(response.data?.addresses || []);
    } catch (error) {
      setError('Failed to load addresses');
      console.error('Error fetching addresses:', error);
    }
  };

  const fetchCart = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:3000/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(response.data.items || []);
    } catch (error) {
      setError('Failed to load cart');
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.productId.price * item.quantity, 0);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setError('Please select a delivery address');
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      // Here you would typically make an API call to create the order
      // For now, we'll simulate a successful order
      await new Promise(resolve => setTimeout(resolve, 1500));
      setOrderPlaced(true);
      
      // Clear cart after successful order
      await axios.post('http://localhost:3000/api/cart/clear', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Redirect to home after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      setError('Failed to place order. Please try again.');
      console.error('Error placing order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <motion.div 
        className="fixed inset-0 bg-white flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div 
          className="text-center"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          <motion.div
            className="w-20 h-20 bg-green-500 rounded-full mx-auto mb-6 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Check className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
          <p className="text-gray-600">Thank you for your purchase</p>
        </motion.div>
      </motion.div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg"
          >
            {error}
          </motion.div>
        )}

        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Select Delivery Address</h2>
          <div className="grid gap-4">
            {addresses.map((address) => (
              <motion.div
                key={address._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01 }}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedAddress?._id === address._id
                    ? 'border-black bg-gray-50'
                    : 'border-gray-200'
                }`}
                onClick={() => setSelectedAddress(address)}
              >
                <p className="font-medium">{address.street}</p>
                <p className="text-gray-600">{`${address.city}, ${address.state} ${address.zipCode}`}</p>
                <p className="text-gray-600">{address.country}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-4">
            {cart.map((item) => (
              <motion.div
                key={item.productId._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.productId.imageUrl}
                    alt={item.productId.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium">{item.productId.name}</p>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-medium">₹{(item.productId.price * item.quantity).toFixed(2)}</p>
              </motion.div>
            ))}

            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between text-lg font-medium">
                <p>Total</p>
                <p>₹{calculateTotal().toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handlePlaceOrder}
          disabled={loading || !selectedAddress}
          className={`w-full bg-black text-white py-4 px-6 rounded-lg font-medium transition-colors ${
            loading || !selectedAddress ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </span>
          ) : (
            'Place Order'
          )}
        </motion.button>
      </motion.div>
    </div>
  );
}