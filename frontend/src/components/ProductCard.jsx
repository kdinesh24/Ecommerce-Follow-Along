import { useState } from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';



export default function ProductCard({
  _id,
  name,
  description,
  price,
  image,
  category,
  subcategory,
  inStock = true
}) {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

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
        "http://localhost:3000/api/cart/add",
        { productId: _id, quantity: 1 },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );
      
      // Optional: Show success message
      toast.success('Added to cart');
    } catch (error) {
      console.error("Error adding to cart:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token'); // Clear invalid token
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
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 bg-white"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-50 rounded-t-lg">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
          className="absolute right-2 top-2 z-10 rounded-full bg-white p-1.5 transition-colors hover:bg-gray-100"
        >
          <Heart
            size={20}
            className={`${
              isFavorite ? 'fill-red-500 stroke-red-500' : 'stroke-gray-600'
            }`}
          />
        </button>
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover object-center p-2 transition-transform duration-300 ease-out group-hover:scale-105"
        />
      </div>
      <div className="mt-1 space-y-1 px-3 pb-3">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{name}</h3>
        <p className="text-xs text-gray-600 line-clamp-1">{description}</p>
        <div className="flex gap-1.5 flex-wrap">
          <span className="inline-block px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200 transition-colors">
            {subcategory}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-md font-semibold text-gray-900">${price.toFixed(2)}</p>
          <button 
            onClick={handleAddToCart}
            className={`rounded-full p-2 text-white transition-colors ${
              inStock 
                ? 'bg-black hover:bg-zinc-800' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            <ShoppingBag size={18}  />
          </button>
        </div>
        {!inStock && (
          <p className="text-xs text-red-500 font-medium">Out of stock</p>
        )}
      </div>
    </div>
  );
}