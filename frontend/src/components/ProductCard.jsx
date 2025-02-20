import { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function ProductCard({
  _id,
  name = 'Unnamed Product',
  description = 'No description available',
  price = 0,
  image = '/placeholder-image.jpg',
  inStock = true
}) {
  const navigate = useNavigate();
  
  const safePrice = Number(price) || 0;

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!inStock) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate('/ecommerce-follow-along/login');
        toast.error('Please login to add items to cart');
        return;
      }

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/cart/add`,
        { productId: _id, quantity: 1 },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );
      
      toast.success('Added to cart');
    } catch (error) {
      console.error("Error adding to cart:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/ecommerce-follow-along/login');
        toast.error('Please login again to add items to cart');
      } else {
        toast.error('Failed to add item to cart');
      }
    }
  };

  const handleCardClick = (e) => {
    if (!e.target.closest('button')) {
      navigate(`/ecommerce-follow-along/product/${_id}`);
    }
  };

  return (
    <motion.div
      className="group cursor-pointer border border-gray-300 rounded-lg overflow-hidden hover:border-black transition-colors duration-300 w-full h-[420px]"
      onClick={handleCardClick}
    >
      <div className="relative overflow-hidden h-64">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/default-product.jpg';
          }}
        />
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleAddToCart}
          className="absolute right-4 top-4 bg-white hover:bg-black hover:text-white text-gray-600 p-3 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300"
          disabled={!inStock}
        >
          <ShoppingBag size={20} />
        </motion.button>
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-gray-800 text-lg line-clamp-1">{name}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold">₹{safePrice.toFixed(2)}</span>
        </div>
      </div>
    </motion.div>
  );
}