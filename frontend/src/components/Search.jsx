import { useState, useEffect } from 'react';
import { X, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSearch } from './SearchContext';

const SearchModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery, searchResults, isLoading, searchProducts } = useSearch();
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setInputValue('');
      setSearchQuery('');
    }
  }, [isOpen]);

  const handleSearch = (value) => {
    setInputValue(value);
    searchProducts(value);
  };

  const handleResultClick = (productId) => {
    onClose();
    navigate(`/ecommerce-follow-along/product/${productId}`);
  };

  const handleViewAll = () => {
    setSearchQuery(inputValue);
    onClose();
    navigate(`/ecommerce-follow-along/search-results?q=${encodeURIComponent(inputValue)}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        >
          <motion.div 
            className="flex items-start justify-center pt-32"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="w-full max-w-2xl mx-4">
              <motion.div 
                className="bg-white/20 backdrop-blur-md rounded-xl shadow-xl overflow-hidden border border-white/30"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
              >
                <div className="relative p-4">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search products..."
                    className="w-full p-4 pr-12 text-lg border-none outline-none bg-transparent text-white placeholder-white/70"
                    autoFocus
                  />
                  <motion.button 
                    onClick={onClose}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X size={24} />
                  </motion.button>
                </div>

                {isLoading ? (
                  <div className="flex justify-center items-center p-8">
                    <Loader className="animate-spin text-white" size={24} />
                  </div>
                ) : searchResults.length > 0 && (
                  <div className="border-t border-white/20">
                    <div className="max-h-64 overflow-y-auto">
                      {searchResults.slice(0, 5).map((product) => (
                        <motion.div
                          key={product._id}
                          className="p-4 hover:bg-white/10 cursor-pointer flex items-center space-x-4"
                          onClick={() => handleResultClick(product._id)}
                          whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                        >
                          <img
                            src={Array.isArray(product.imageUrl) ? product.imageUrl[0] : product.imageUrl}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h3 className="text-white font-medium">{product.name}</h3>
                            <p className="text-white/70 text-sm">{product.category}</p>
                          </div>
                        
                        </motion.div>
                      ))}
                    </div>
                    {searchResults.length > 5 && (
                      <div className="p-4 border-t border-white/20">
                        <button
                          onClick={handleViewAll}
                          className="w-full py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                          View all {searchResults.length} results
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;