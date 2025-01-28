import React, { useState } from 'react';
import { Heart } from 'lucide-react';

const ProductCard = ({ name, price, image, description }) => {
  const [liked, setLiked] = useState(false);

  const toggleLike = () => {
    setLiked(!liked);
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group relative transform hover:-translate-y-2 hover:scale-[1.03]">
      <div className="relative h-64 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:brightness-90"
        />
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button className="bg-white/80 text-gray-800 px-6 py-3 rounded-full shadow-md hover:bg-white hover:shadow-xl transition-all duration-300">
            Quick View
          </button>
        </div>
        <button
          className="absolute top-4 right-4 bg-white/80 p-2 rounded-full shadow-md hover:bg-white hover:shadow-xl transition-all duration-300 z-10"
          onClick={toggleLike}
        >
          {liked ? <Heart className="text-black" /> : <Heart className="text-black" />}
        </button>
      </div>
      <div className="p-6 space-y-3">
        <h3 className="text-xl font-semibold text-gray-800 truncate">{name}</h3>
        <p className="text-gray-600 text-sm line-clamp-2">{description}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-2xl font-bold text-gray-800">${price.toFixed(2)}</span>
          <button className="bg-black text-white px-5 py-2 rounded-full hover:bg-gray-800 transition-colors duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;