import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Loader2, CreditCard, Banknote, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Footer from './Footer';

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } }
};

export default function Payment() {
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [error, setError] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { orderData } = location.state || {};

useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/ecommerce-follow-along/login');
      return;
    }
    
    if (!orderData) {
      navigate('/ecommerce-follow-along/order');
      return;
    }
    
    fetchUserDetails();
  }, [navigate, orderData]);

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

  const handlePayment = async () => {
    try {
      setLoading(true);
      
      const { data } = await axios.post(
        "http://localhost:3000/api/pay/checkout",
        { total: orderData.total }
      );
  
      const options = {
        key: "rzp_test_Lvyx7TybXsDiFV",
        amount: data.order.amount,
        currency: "INR",
        name: "Makers Vault",
        description: "Test Payment",
        order_id: data.order.id,
       
        handler: function (response) {
          console.log("Razorpay response:", response);
  
        
          axios
            .post(
              `${import.meta.env.VITE_API_URL}/api/orders`,
              {
                deliveryAddress: orderData.deliveryAddress,
                paymentMethod: 'ONLINE',
            
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            )
            .then((res) => {
              console.log('Order created:', res.data);
              toast.success('Order placed successfully!');
             
              localStorage.removeItem('cart');
              navigate("/ecommerce-follow-along/home");
            })
            .catch((err) => {
              console.error('Error creating order:', err);
              toast.error('Order placement failed. Please contact support.');
            });
        },
        prefill: {
          name: userDetails?.name || "Customer",
          email: userDetails?.email || "test@example.com",
          contact: "8248777476",
        },
        theme: { color: "#3399cc" },
      };
  
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment failed:", error);
      toast.error("Payment initialization failed");
    } finally {
      setLoading(false);
    }
  };
  

  const handleCashOnDelivery = async () => {
    setLoading(true);
    setError(null);
  
    try {
      const token = localStorage.getItem('token');
      
      const orderPayload = {
        deliveryAddress: orderData.deliveryAddress,
        paymentMethod: 'COD'
      };
  
      console.log('Order data being sent:', orderPayload);
  
     
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/orders`,
        orderPayload,
        { headers: { Authorization: `Bearer ${token}` }}
      );
  
      console.log('Order response:', response.data);
  
     
      setOrderPlaced(true);
      toast.success('Order placed successfully!');
      
   
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

  if (!orderData) {
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
              <h1 className="text-xl font-semibold text-gray-900">Payment</h1>
              <div className="w-20" />
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No order information found</h2>
            <button
              onClick={() => navigate('/ecommerce-follow-along/order')}
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
            >
              Return to Checkout
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
            <h1 className="text-xl font-semibold text-gray-900">Payment</h1>
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

          {/* Payment Summary */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Payment Summary</h2>
            <div className="py-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span>₹{orderData.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Shipping</span>
                <span>₹0.00</span>
              </div>
              <div className="flex justify-between font-medium text-lg pt-4 border-t">
                <span>Total</span>
                <span>₹{orderData.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Select Payment Method</h2>
            
            <div className="space-y-4">
              {/* Online Payment Option */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  paymentMethod === 'ONLINE' 
                    ? 'border-black bg-gray-50 shadow-sm' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setPaymentMethod('ONLINE')}
              >
                <div className="flex items-start">
                  <CreditCard className="w-6 h-6 mr-3 mt-1 text-gray-600" />
                  <div>
                    <p className="font-medium">Pay Online</p>
                    <p className="text-gray-600 text-sm">Pay using UPI, Debit/Credit Card, Net Banking</p>
                  </div>
                  {paymentMethod === 'ONLINE' && (
                    <span className="ml-auto bg-black text-white text-xs px-2 py-1 rounded">Selected</span>
                  )}
                </div>
              </motion.div>

              {/* Cash on Delivery Option */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  paymentMethod === 'COD' 
                    ? 'border-black bg-gray-50 shadow-sm' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setPaymentMethod('COD')}
              >
                <div className="flex items-start">
                  <Banknote className="w-6 h-6 mr-3 mt-1 text-gray-600" />
                  <div>
                    <p className="font-medium">Cash on Delivery</p>
                    <p className="text-gray-600 text-sm">Pay when your order is delivered</p>
                  </div>
                  {paymentMethod === 'COD' && (
                    <span className="ml-auto bg-black text-white text-xs px-2 py-1 rounded">Selected</span>
                  )}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Payment Action Buttons */}
          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={paymentMethod === 'ONLINE' ? handlePayment : handleCashOnDelivery}
              disabled={loading || !paymentMethod}
              className={`w-full bg-black text-white py-4 rounded-lg text-lg font-medium ${
                loading || !paymentMethod
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
                paymentMethod === 'ONLINE' ? 'Proceed to Pay Online' : 'Confirm Cash on Delivery'
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>

      <Footer />
    </motion.div>
  );
}