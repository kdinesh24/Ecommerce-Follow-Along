import React from "react";

export default function ProductCard({ name, price, image, inStock = true }) {
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
          className="absolute right-3 top-3 p-1"
          aria-label="Add to wishlist"
        >
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            className="text-gray-800"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
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
