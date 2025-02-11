import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard'; // Adjust import path as needed

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/ecommerce-follow-along/login');
        toast.error('Please login to view wishlist');
        return;
      }

      const response = await axios.get('http://localhost:3000/api/wishlist', {
        headers: { 
          'Authorization': `Bearer ${token}`,
        }
      });

      console.log('Wishlist Response:', response.data); // Log the response to check the structure

      // Ensure all items have required properties
      const formattedItems = response.data.map(item => ({
        _id: item._id,
        name: item.name,
        price: Number(item.price) || 0,
        imageUrl: item.imageUrl || 'path/to/default/image.jpg', // Fallback image if not available
        isFavorite: true
      }));

      setWishlistItems(formattedItems);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setIsLoading(false);
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/ecommerce-follow-along/login');
        toast.error('Please login again');
      } else {
        toast.error('Failed to load wishlist');
      }
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleToggleFavorite = (productId) => {
    // Remove the item from wishlist immediately
    setWishlistItems(prevItems => 
      prevItems.filter(item => item._id !== productId)
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading wishlist...</p>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Your wishlist is empty</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlistItems.map(item => (
          <ProductCard
            key={item._id}
            {...item}
            onToggleFavorite={handleToggleFavorite}
          />
        ))}
      </div>
    </div>
  );
}