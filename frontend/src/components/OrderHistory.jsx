"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, ShoppingBag, Package, Truck, CheckCircle, AlertTriangle, ChevronDown, ChevronUp, Calendar, MapPin, DollarSign, XCircle } from "lucide-react";
import axios from "axios";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

const slideIn = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};


const statusIcons = {
  pending: { icon: FileText, color: "text-yellow-500", bgColor: "bg-yellow-50" },
  processing: { icon: ShoppingBag, color: "text-blue-500", bgColor: "bg-blue-50" },
  shipped: { icon: Truck, color: "text-purple-500", bgColor: "bg-purple-50" },
  delivered: { icon: CheckCircle, color: "text-green-500", bgColor: "bg-green-50" },
  success: { icon: CheckCircle, color: "text-green-500", bgColor: "bg-green-50" },
  cancelled: { icon: XCircle, color: "text-gray-500", bgColor: "bg-gray-50" }
};

const cancelReasons = [
  { value: 'changed_mind', label: 'Changed my mind' },
  { value: 'wrong_item', label: 'Ordered wrong item' },
  { value: 'delivery_time_too_long', label: 'Delivery time too long' },
  { value: 'found_better_price', label: 'Found better price elsewhere' },
  { value: 'other', label: 'Other' }
];

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelDescription, setCancelDescription] = useState('');

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsSeller(response.data.isSeller);
      } catch (error) {
        console.error('Error checking user role:', error);
      }
    };

    checkUserRole();
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await axios.get('http://localhost:3000/api/orders', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setOrders(response.data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load order history. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const handleCancelOrder = async (orderId) => {
    setSelectedOrder(orderId);
    setCancelModalOpen(true);
  };

  const submitCancelOrder = async () => {
    try {
      if (!cancelReason || !cancelDescription) {
        setError('Please provide both reason and description');
        return;
      }
  
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:3000/api/orders/${selectedOrder}/cancel`,
        { 
          cancelReason, 
          cancelDescription 
        },
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
  
      setCancelModalOpen(false);
      setSelectedOrder(null);
      setCancelReason('');
      setCancelDescription('');
      await fetchOrders(); 
    } catch (error) {
      console.error('Error cancelling order:', error);
      setError(error.response?.data?.message || 'Error cancelling order');
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:3000/api/orders/${orderId}/seller-status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const renderProgressBar = (order) => {
    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${order.progressStatus}%` }}
        ></div>
      </div>
    );
  };

  const renderOrderActions = (order) => {
    if (order.status === 'cancelled') return null;

    return (
      <div className="mt-4 flex gap-2">
        {!isSeller && ['pending', 'processing'].includes(order.status) && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCancelOrder(order._id);
            }}
            className="px-4 py-2 text-sm text-red-600 border border-red-600 rounded-lg hover:bg-red-50"
          >
            Cancel Order
          </button>
        )}

        {isSeller && order.status === 'pending' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              updateOrderStatus(order._id, 'success');
            }}
            className="px-4 py-2 text-sm text-green-600 border border-green-600 rounded-lg hover:bg-green-50"
          >
            Mark as Success
          </button>
        )}
      </div>
    );
  };

  const CancelOrderModal = () => {
    if (!cancelModalOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h3 className="text-lg font-medium mb-4">Cancel Order</h3>

          <select
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            className="w-full p-2 border rounded-lg mb-4"
          >
            <option value="">Select a reason</option>
            {cancelReasons.map(reason => (
              <option key={reason.value} value={reason.value}>
                {reason.label}
              </option>
            ))}
          </select>

          <textarea
            value={cancelDescription}
            onChange={(e) => setCancelDescription(e.target.value)}
            placeholder="Additional details (optional)"
            className="w-full p-2 border rounded-lg mb-4 h-24"
          />

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setCancelModalOpen(false)}
              className="px-4 py-2 text-gray-600 border rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={submitCancelOrder}
              disabled={!cancelReason}
              className="px-4 py-2 bg-red-600 text-white rounded-lg disabled:opacity-50"
            >
              Confirm Cancellation
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="flex h-64 items-center justify-center"
      >
        <div className="flex items-center justify-center space-x-2">
          <div className="h-4 w-4 animate-bounce rounded-full bg-black [animation-delay:-0.3s]"></div>
          <div className="h-4 w-4 animate-bounce rounded-full bg-black [animation-delay:-0.15s]"></div>
          <div className="h-4 w-4 animate-bounce rounded-full bg-black"></div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="flex h-64 items-center justify-center"
      >
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-600">
          {error}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="pb-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">Order History</h2>
        <p className="mt-2 text-gray-500">View and track your past orders</p>
      </div>

      {orders.length === 0 ? (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={slideIn}
          className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-2xl border border-gray-100"
        >
          <ShoppingBag className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-500 mb-6">Your order history will appear here</p>
          <button
            onClick={() => window.location.href = '/ecommerce-follow-along/home'}
            className="px-6 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors duration-200"
          >
            Start Shopping
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="space-y-6"
        >
          {orders.map((order, index) => {
            const StatusIcon = statusIcons[order.status]?.icon || FileText;
            const statusColor = statusIcons[order.status]?.color || "text-gray-500";
            const statusBgColor = statusIcons[order.status]?.bgColor || "bg-gray-50";
            const isExpanded = expandedOrderId === order._id;

            return (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div
                  className="p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => toggleOrderDetails(order._id)}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg ${statusBgColor}`}>
                        <StatusIcon className={`w-5 h-5 ${statusColor}`} />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Order #{order._id.slice(-6)}</h3>
                        <p className="text-xs text-gray-500 mt-1 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(order.orderDate)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="text-center md:text-right">
                        <p className="text-xs text-gray-500">Status</p>
                        <p className={`text-sm font-medium ${statusColor} capitalize`}>{order.status}</p>
                      </div>

                      <div className="text-center md:text-right">
                        <p className="text-xs text-gray-500">Amount</p>
                        <p className="text-sm font-medium text-gray-900">{formatCurrency(order.totalAmount)}</p>
                      </div>

                      <div className="text-gray-400">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-gray-100 p-6 bg-gray-50"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      <div className="md:col-span-8">
                        <h4 className="text-sm font-medium text-gray-900 mb-4">Order Items</h4>
                        <div className="space-y-4">
                          {order.products.map((item, i) => (
                            <div key={i} className="bg-white p-4 rounded-lg border border-gray-100 flex items-center gap-4">
                              <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                                {item.product?.images?.length > 0 ? (
                                  <img
                                    src={`http://localhost:3000/${item.product.images[0]}`}
                                    alt={item.product.name}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <ShoppingBag className="w-6 h-6 text-gray-400" />
                                )}
                              </div>
                              <div className="flex-1">
                                <h5 className="text-sm font-medium text-gray-900">{item.product?.name || "Product Unavailable"}</h5>
                                <p className="text-xs text-gray-500 mt-1">Quantity: {item.quantity}</p>
                              </div>
                              <div className="text-sm font-medium text-gray-900">
                                {formatCurrency(item.price * item.quantity)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="md:col-span-4 space-y-6">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            Delivery Address
                          </h4>
                          <div className="bg-white p-4 rounded-lg border border-gray-100">
                            <p className="text-sm text-gray-700">{order.deliveryAddress.street}</p>
                            <p className="text-sm text-gray-700">
                              {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}
                            </p>
                            <p className="text-sm text-gray-700">{order.deliveryAddress.country}</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                            <DollarSign className="w-4 h-4 mr-1" />
                            Order Summary
                          </h4>
                          <div className="bg-white p-4 rounded-lg border border-gray-100">
                            <div className="flex justify-between py-2 border-b border-gray-100">
                              <span className="text-sm text-gray-500">Subtotal</span>
                              <span className="text-sm font-medium text-gray-900">
                                {formatCurrency(order.totalAmount - (order.totalAmount * 0.05))}
                              </span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100">
                              <span className="text-sm text-gray-500">Shipping</span>
                              <span className="text-sm font-medium text-gray-900">
                                {formatCurrency(order.totalAmount * 0.05)}
                              </span>
                            </div>
                            <div className="flex justify-between py-2 mt-2">
                              <span className="text-sm font-medium text-gray-900">Total</span>
                              <span className="text-sm font-bold text-gray-900">
                                {formatCurrency(order.totalAmount)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {renderProgressBar(order)}
                    {renderOrderActions(order)}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      )}
      <CancelOrderModal />
    </div>
  );
}
