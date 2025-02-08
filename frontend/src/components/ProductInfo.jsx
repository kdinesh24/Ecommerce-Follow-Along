import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ShoppingBag, Heart } from 'lucide-react';
import Footer from './Footer';

export default function ProductInfo() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
        try {
            console.log('Fetching product with ID:', id); // Add this
            const response = await axios.get(`http://localhost:3000/items/products/${id}`);
            console.log('Product data:', response.data); // Add this
            setProduct(response.data);
        } catch (error) {
            console.error('Error fetching product details:', error);
            setError('Error fetching product details');
        } finally {
            setLoading(false);
        }
    };
    fetchProduct();
}, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950 text-gray-200">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950 text-red-400">
        {error || 'Product not found'}
      </div>
    );
  }

  return (
    <>
        
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="relative">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-auto object-cover rounded-lg"
            />
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 shadow-md hover:bg-gray-100"
            >
              <Heart
                size={24}
                className={isFavorite ? 'fill-red-500 stroke-red-500' : 'stroke-gray-600'}
              />
            </button>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-xl text-gray-900 font-semibold">${product.price.toFixed(2)}</p>
            <p className="text-gray-600">{product.description}</p>
            
            <div className="flex gap-2">
              <span className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-800 rounded-full">
                {product.category}
              </span>
              <span className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-800 rounded-full">
                {product.subcategory}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button className="w-full py-3 px-8 bg-black text-white rounded-full hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2">
                <ShoppingBag size={20} />
                Add to Cart
              </button>
              <button className="w-full py-3 px-8 border-2 border-black text-black rounded-full hover:bg-black hover:text-white transition-colors">
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
    </>
  );
}