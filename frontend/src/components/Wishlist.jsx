import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';

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

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/wishlist`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
        }
      });

      console.log('Wishlist Response:', response.data);

      // Map the API response.
      // Here we assume the API returns an "image" property.
      // If the "image" is a relative path, we prefix it with the backend host.
      // Otherwise, if there's no image, we use the fallback image.
      const formattedItems = response.data.map(item => {
        let imageUrl = '/images/default-product.jpg';
        if (item.image) {
          imageUrl = item.image.startsWith('http')
            ? item.image
            : `http://localhost:3000/${item.image}`;
        }

        return {
          _id: item._id,
          name: item.name,
          price: Number(item.price) || 0,
          imageUrl,
          isFavorite: true
        };
      });

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
    // Remove the item from the wishlist immediately
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
            imageUrl={item.imageUrl}
          />
        ))}
      </div>
    </div>
  );
}