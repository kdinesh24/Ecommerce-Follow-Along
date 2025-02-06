import React, { useState, createContext, useContext } from 'react';
import { Heart } from 'lucide-react';

// Create Wishlist Context
const WishlistContext = createContext();

// Wishlist Provider Component
export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([]);

  const addToWishlist = (product) => {
    setWishlistItems((prev) => {
      const exists = prev.find((item) => item.name === product.name);
      if (!exists) {
        return [...prev, product];
      }
      return prev;
    });
  };

  const removeFromWishlist = (productName) => {
    setWishlistItems((prev) => 
      prev.filter((item) => item.name !== productName)
    );
  };

  const isInWishlist = (productName) => {
    return wishlistItems.some((item) => item.name === productName);
  };

  return (
    <WishlistContext.Provider 
      value={{ 
        wishlistItems, 
        addToWishlist, 
        removeFromWishlist,
        isInWishlist 
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

// Custom hook to use wishlist
const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

// ProductCard Component
export default function ProductCard({
  name,
  description,
  price,
  image,
  category,
  subcategory,
  inStock = true
}) {
  const [showDetails, setShowDetails] = useState(false);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(name);

  const handleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(name);
    } else {
      addToWishlist({
        name,
        description,
        price,
        image,
        category,
        subcategory,
        inStock
      });
    }
  };

  return (
    <div className="group relative flex flex-col">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-contain object-center transition-transform duration-300 ease-out group-hover:scale-105"
        />
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
        <div className="absolute bottom-0 left-0 right-0 translate-y-full transition-transform duration-200 ease-out group-hover:translate-y-0">
          <button className="w-full bg-black py-3 text-sm font-normal text-white hover:bg-zinc-800">
            ADD TO CART
          </button>
        </div>
      </div>
      <div className="mt-2 space-y-1 px-1">
        <h3 className="text-sm font-medium text-gray-900">{name}</h3>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
        <div className="flex gap-2 flex-wrap mt-1">
          <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded capitalize">
            {subcategory}
          </span>
        </div>
        <p className="text-md font-medium text-gray-900 mt-1">₹{price.toFixed(2)}</p>
        {!inStock && (
          <p className="text-xs text-red-500 font-medium">Out of stock</p>
        )}
      </div>
    </div>
  );
}