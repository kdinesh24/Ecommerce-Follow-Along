import { useState, useEffect } from 'react';
import { Heart, ShoppingBag, Tag } from 'lucide-react';
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
  category = 'Uncategorized',
  subcategory = 'No Subcategory',
  inStock = true,
  isFavorite: initialIsFavorite = false,
  onToggleFavorite
}) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const navigate = useNavigate();

  // Ensure price is always a number
  const safePrice = Number(price) || 0;

  useEffect(() => {
    setIsFavorite(initialIsFavorite);
  }, [initialIsFavorite]);

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

  const handleToggleFavorite = async (e) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate('/ecommerce-follow-along/login');
        toast.error('Please login to add items to wishlist');
        return;
      }

      await axios.post(
        "http://localhost:3000/api/wishlist/toggle",
        { productId: _id },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      setIsFavorite(!isFavorite);
      if (onToggleFavorite) {
        onToggleFavorite(_id);
      }
      toast.success(isFavorite ? 'Removed from wishlist' : 'Added to wishlist');
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/ecommerce-follow-along/login');
        toast.error('Please login again to update wishlist');
      } else {
        toast.error('Failed to update wishlist');
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      onClick={handleCardClick}
      className="group relative flex flex-col rounded-xl shadow-md hover:shadow-xl transition-all duration-300 bg-white h-[450px]"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-gray-50 rounded-t-xl">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleToggleFavorite}
          className="absolute right-3 top-3 z-10 rounded-full bg-white p-2 transition-colors hover:bg-gray-100 shadow-md"
        >
          <motion.div
            animate={isFavorite ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <Heart
              size={20}
              className={`${
                isFavorite ? 'fill-red-500 stroke-red-500' : 'stroke-gray-600'
              }`}
            />
          </motion.div>
        </motion.button>
        <motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
          src={image}
          alt={name}
          className="h-full w-full object-cover object-center p-4"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/default-product.jpg'; // Fallback image in case of error
          }}
        />
      </div>
      <div className="flex-1 flex flex-col justify-between p-4 space-y-3">
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-900 line-clamp-1">{name}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2"
          >
            <Tag size={14} className="text-gray-500" />
            <div className="flex gap-2">
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors">
                {category}
              </span>
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                {subcategory}
              </span>
            </div>
          </motion.div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xl font-bold text-gray-900">₹{safePrice.toFixed(2)}</p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              className={`rounded-full p-3 text-white transition-all ${
                inStock 
                  ? 'bg-black hover:bg-zinc-800 shadow-md hover:shadow-lg' 
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              <ShoppingBag size={20} />
            </motion.button>
          </div>
          {!inStock && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 text-red-600 text-sm font-medium px-3 py-1 rounded-lg text-center"
            >
              Out of stock
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}