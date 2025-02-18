import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Loader2, MapPin, UserCircle2, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Footer from './Footer';

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } }
};

export default function Order() {
  const [userDetails, setUserDetails] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/ecommerce-follow-along/login');
      return;
    }
    fetchInitialData();
  }, [navigate]);

  const fetchInitialData = async () => {
    try {
      await Promise.all([
        fetchUserDetails(),
        fetchAddresses(),
        fetchCart()
      ]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching initial data:', error);
      setLoading(false);
      toast.error('Failed to load order details');
    }
  };

  const fetchUserDetails = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/check-auth`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data && response.data.user) {
        setUserDetails(response.data.user);
      } else {
        throw new Error("User data not found");
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast.error('Failed to load user details');
      navigate('/ecommerce-follow-along/login');
    }
  };

  const fetchAddresses = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/addresses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAddresses(response.data?.addresses || []);
      if (response.data?.addresses?.length > 0) {
        setSelectedAddress(response.data.addresses[0]);
      }
    } catch (error) {
      toast.error('Failed to load addresses');
      console.error('Error fetching addresses:', error);
    }
  };

  const fetchCart = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const validItems = (response.data.items || []).filter(item => item && item.productId);
      setCart(validItems);
    } catch (error) {
      setError('Failed to load cart');
      console.error('Error fetching cart:', error);
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      if (!item || !item.productId) return total;
      return total + (item.productId.price || 0) * (item.quantity || 1);
    }, 0);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setError('Please select a delivery address');
      return;
    }
  
    if (cart.length === 0) {
      setError('Your cart is empty');
      return;
    }
  
    setLoading(true);
    setError(null);
  
    try {
      const token = localStorage.getItem('token');
      
      // Preparing the order data according to what the backend expects
      const orderData = {
        deliveryAddress: {
          street: selectedAddress.street,
          city: selectedAddress.city,
          state: selectedAddress.state,
          zipCode: selectedAddress.zipCode,
          country: selectedAddress.country
        },
      };
  
      console.log('Order data being sent:', orderData);
  
      // Send the order request to create an order using the current cart
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/orders`,
        orderData,
        { headers: { Authorization: `Bearer ${token}` }}
      );
  
      console.log('Order response:', response.data);
  
      // Order was successful
      setOrderPlaced(true);
      toast.success('Order placed successfully!');
      
      // Clear the cart in local state
      setCart([]);
  
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/ecommerce-follow-along/home');
      }, 2000);
  
    } catch (error) {
      console.error('Order placement error:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Failed to place order. Please try again.');
      }
      toast.error('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '/placeholder.jpg';
    if (imageUrl.startsWith('http')) return imageUrl;
    if (imageUrl.startsWith('/')) return `${import.meta.env.VITE_API_URL}${imageUrl}`;
    return `${import.meta.env.VITE_API_URL}/uploads/${imageUrl}`;
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
          <p className="text-gray-600">Thank you for your purchase, {userDetails?.name}!</p>
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

  if (!loading && (!cart || cart.length === 0)) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Checkout</h1>
              <div className="w-20" />
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <button
              onClick={() => navigate('/ecommerce-follow-along/home')}
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
            >
              Continue Shopping
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeIn} className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Checkout</h1>
            <div className="w-20" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg"
            >
              {error}
            </motion.div>
          )}

          {/* User Details Section */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              <UserCircle2 className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Customer Details</h2>
            </div>
            <div className="space-y-2">
              <p className="text-gray-700"><span className="font-medium">Name:</span> {userDetails?.name}</p>
              <p className="text-gray-700"><span className="font-medium">Email:</span> {userDetails?.email}</p>
            </div>
          </div>

          {/* Addresses Section */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <MapPin className="w-6 h-6" />
                <h2 className="text-xl font-semibold">Delivery Address</h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/ecommerce-follow-along/profile')}
                className="text-sm text-black hover:text-gray-700 underline"
              >
                Manage Addresses
              </motion.button>
            </div>

            <div className="grid gap-4">
              {addresses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">No addresses found</p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/ecommerce-follow-along/profile')}
                    className="bg-black text-white px-6 py-2 rounded-lg"
                  >
                    Add New Address
                  </motion.button>
                </div>
              ) : (
                addresses.map((address) => (
                  <motion.div
                    key={address._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.01 }}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedAddress?._id === address._id
                        ? 'border-black bg-gray-50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedAddress(address)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{address.street}</p>
                        <p className="text-gray-600">{`${address.city}, ${address.state} ${address.zipCode}`}</p>
                        <p className="text-gray-600">{address.country}</p>
                      </div>
                      {selectedAddress?._id === address._id && (
                        <span className="bg-black text-white text-xs px-2 py-1 rounded">Selected</span>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4">
              {cart.map((item) => {
                if (!item || !item.productId) return null;
                return (
                  <motion.div
                    key={item.productId._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={getImageUrl(item.productId.imageUrl)}
                        alt={item.productId.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium">{item.productId.name}</p>
                        <p className="text-gray-600">Quantity: {item.quantity || 1}</p>
                      </div>
                    </div>
                    <p className="font-medium">₹{((item.productId.price || 0) * (item.quantity || 1)).toFixed(2)}</p>
                  </motion.div>
                );
              })}

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
            disabled={loading || !selectedAddress || cart.length === 0}
            className={`w-full bg-black text-white py-4 rounded-lg text-lg font-medium ${
              loading || !selectedAddress || cart.length === 0
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-gray-800'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Processing...
              </span>
            ) : (
              'Place Order'
            )}
          </motion.button>
        </motion.div>
      </div>

      <Footer />
    </motion.div>
  );
}