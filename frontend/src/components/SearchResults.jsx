import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSearch } from './SearchContext';
import { ShoppingBag } from 'lucide-react';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || '';
  const { searchResults, searchProducts, isLoading } = useSearch();

  useEffect(() => {
    searchProducts(query);
  }, [query]);

  const handleProductClick = (productId) => {
    navigate(`/ecommerce-follow-along/product/${productId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">Search Results</h1>
          <p className="text-gray-600 mt-2">
            {searchResults.length} results found for "{query}"
          </p>
        </motion.div>

        {searchResults.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 text-lg">No products found matching your search.</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {searchResults.map((product) => (
              <motion.div
                key={product._id}
                whileHover={{ y: -8 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer"
                onClick={() => handleProductClick(product._id)}
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={Array.isArray(product.imageUrl) ? product.imageUrl[0] : product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">{product.name}</h2>
                  <p className="text-gray-600 text-sm mb-2">{product.category}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xl font-bold text-gray-900">₹{product.price.toFixed(2)}</p>
                    <button className="p-2 rounded-full hover:bg-gray-100">
                      <ShoppingBag size={20} className="text-gray-600" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;