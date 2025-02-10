import { useEffect, useState } from "react";
import axios from "axios";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate('/ecommerce-follow-along/login');
      return;
    }
    fetchCart();
  }, [navigate]);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error('No token found');
      }
      const response = await axios.get("http://localhost:3000/api/cart", {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      setCart(response.data.items || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setLoading(false);
      if (error.response?.status === 401 || error.message === 'No token found') {
        localStorage.removeItem('token'); // Clear invalid token
        navigate('/ecommerce-follow-along/login');
        toast.error('Please login to view your cart');
      }
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/cart/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCart();
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3000/api/cart/add",
        { productId, quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart();
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.productId.price * item.quantity, 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '/placeholder.jpg';
    if (imageUrl.startsWith('http')) return imageUrl;
    if (imageUrl.startsWith('/')) return `http://localhost:3000${imageUrl}`;
    return `http://localhost:3000/uploads/${imageUrl}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
        <span className="text-gray-500">{cart.length} items</span>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Your cart is empty</h3>
          <p className="mt-1 text-gray-500">Start adding some items to your cart!</p>
          <button
            onClick={() => navigate("/products")}
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="bg-white shadow-sm rounded-lg">
            {cart.map((item) => (
              <div
                key={item.productId._id}
                className="flex items-center gap-6 p-6 border-b last:border-b-0"
              >
                <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
                  <img
                    src={getImageUrl(item.productId.imageUrl)}
                    alt={item.productId.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.log('Image failed to load:', item.productId.imageUrl);
                      e.target.onerror = null;
                      e.target.src = "/placeholder.jpg";
                    }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-900">
                    {item.productId.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {item.productId.description}
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    ₹{item.productId.price}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded-md">
                    <button
                      onClick={() => updateQuantity(item.productId._id, item.quantity - 1)}
                      className="p-2 hover:bg-gray-50"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-4 py-2 text-gray-900">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}
                      className="p-2 hover:bg-gray-50"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.productId._id)}
                    className="p-2 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white shadow-sm rounded-lg p-6">
            <div className="space-y-4">
              <div className="flex justify-between text-base font-medium text-gray-900">
                <p>Subtotal</p>
                <p>₹{calculateTotal().toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-base font-medium text-gray-500">
                <p>Shipping</p>
                <p>Calculated at checkout</p>
              </div>
              <div className="border-t pt-4 flex justify-between text-lg font-medium text-gray-900">
                <p>Total</p>
                <p>₹{calculateTotal().toFixed(2)}</p>
              </div>
            </div>

            <div className="mt-6">
              <button className="w-full bg-black text-white py-3 px-4 rounded-md hover:bg-gray-800 transition-colors">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;