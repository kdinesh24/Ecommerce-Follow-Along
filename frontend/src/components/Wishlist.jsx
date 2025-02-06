import React from 'react';
import { Heart } from 'lucide-react';
import ProductCard, { useWishlist } from './ProductCard';

export default function Wishlist() {
  const { wishlistItems } = useWishlist();

  if (wishlistItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Heart size={48} className="text-gray-300 mb-4" />
        <h2 className="text-xl font-medium text-gray-900">Your wishlist is empty</h2>
        <p className="text-gray-600 mt-2">Add items you love to your wishlist</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlistItems.map((item) => (
          <ProductCard key={item.name} {...item} />
        ))}
      </div>
    </div>
  );
}