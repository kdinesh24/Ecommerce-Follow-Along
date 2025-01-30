import React, { useState } from 'react';
import { Heart } from 'lucide-react';

export default function ProductCard({ name, price, image, inStock = true }) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div className="group relative flex flex-col">
      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover object-center transition-transform duration-300 ease-out group-hover:scale-105"
        />
        {/* Add to Wishlist button */}
        <button
          onClick={handleWishlist}
          className="absolute right-3 top-3 rounded-full bg-white p-2 shadow-sm transition-all hover:scale-110 active:scale-95"
          aria-label="Add to wishlist"
        >
          <Heart
            size={20}
            className={`transition-colors ${
              isWishlisted 
                ? 'fill-red-500 stroke-red-500' 
                : 'stroke-gray-600 hover:stroke-gray-900'
            }`}
          />
        </button>
        {/* Add to Cart Button - Only shows on hover */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full transition-transform duration-200 ease-out group-hover:translate-y-0">
          <button className="w-full bg-white py-3 text-sm font-normal text-gray-900 hover:bg-gray-100">
            ADD TO CART
          </button>
        </div>
      </div>
      {/* Product Info */}
      <div className="mt-2 space-y-1 px-1">
        <h3 className="text-sm font-normal text-gray-900">{name}</h3>
        <p className="text-sm font-normal text-gray-900">₹{price.toFixed(2)}</p>
        {!inStock && (
          <p className="text-xs text-gray-500">Out of stock</p>
        )}
      </div>
    </div>
  );
}