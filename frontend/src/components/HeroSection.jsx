import { useState, useEffect } from 'react';
import { User, Search, X, Heart, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const SearchModal = ({ isOpen, onClose }) => {
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
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const MakersVaultHero = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      try {
        const parsedData = JSON.parse(storedUserData)
        setUserData(parsedData)
      } catch (error) {
        console.error('Error parsing userData:', error)
      }
    }
  }, [])

  const slides = [
    {
      image: "https://static.zara.net/assets/public/d02c/c45c/0bb34ffeb9a1/4b93ba580a48/image-landscape-default-fill-9986cf18-578d-4734-9c1d-b1914a5743dd-default_0/image-landscape-default-fill-9986cf18-578d-4734-9c1d-b1914a5743dd-default_0.jpg?ts=1738164069159&w=1905",
    },
    {
      image: "https://images.unsplash.com/photo-1616640045164-deb3b104c4b6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      image: "https://img.freepik.com/free-photo/portrait-fabulous-young-woman-wearing-striped-overall-hat-sitting-black-shiny-surface-building_627829-10555.jpg?t=st=1739978314~exp=1739981914~hmac=9c8851a6bb7de5614a4515bad05ceb66771b478f9118cc6e4032d8408f3e04cc&w=1380",
    },
    {
      image: "https://static.nike.com/a/images/w_1920,c_limit/b01bada9-c96a-4ad9-ac83-6a9e51e1107c/what-to-do-if-you-get-a-blood-blister-on-your-toe-according-to-podiatrists.jpg",
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const handleProfileClick = () => {
    navigate('/ecommerce-follow-along/seller');
  };

  const renderSellerButton = () => {
    if (userData?.isSeller && userData?.currentRole === 'seller') {
      return (
        <motion.button 
          onClick={handleProfileClick} 
          className="px-6 py-2 text-white border border-white-400 rounded-full hover:bg-white hover:text-black transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Your Products
        </motion.button>
      );
    }
    return null;
  };

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 }
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen bg-white p-6 lg:p-8 mb-10 flex flex-col">
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      
      <motion.div 
        className="w-full h-[90vh] rounded-[2rem] overflow-hidden relative"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.nav 
          className="absolute top-0 left-0 right-0 px-8 py-6 flex justify-between items-center z-20"
          variants={navVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="flex items-center space-x-3"
            variants={itemVariants}
          >
            <div className="bg-white rounded-lg px-3 py-1.5">
              <span className="text-black font-bold text-lg">MV</span>
            </div>
          </motion.div>

          <div className="hidden lg:flex items-center space-x-12">
            <motion.a 
              onClick={() => navigate('/ecommerce-follow-along/lifestyle')} 
              className="glowing-text text-white transition duration-300 cursor-pointer"
              variants={itemVariants}
              whileHover={{ scale: 1.1 }}
            >
              Lifestyle
            </motion.a>
            <motion.a 
              href="/ecommerce-follow-along/shoes" 
              className="glowing-text text-white transition duration-300"
              variants={itemVariants}
              whileHover={{ scale: 1.1 }}
            >
              Shoes
            </motion.a>
            <motion.a 
              onClick={() => navigate('/ecommerce-follow-along/perfume')} 
              className="glowing-text text-white transition duration-300 cursor-pointer"
              variants={itemVariants}
              whileHover={{ scale: 1.1 }}
            >
              Perfumes
            </motion.a>
            {renderSellerButton()}        
          </div>

          <motion.div 
            className="flex items-center space-x-6"
            variants={itemVariants}
          >
            <motion.button 
              onClick={() => setIsSearchOpen(true)}
              className="text-white hover:text-gray-200 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Search size={22} />
            </motion.button>

            <motion.button 
              onClick={() => navigate('/ecommerce-follow-along/wishlist')}
              className="text-white hover:text-gray-200 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Heart size={22} />
            </motion.button>
            <motion.button
              onClick={() => navigate('/ecommerce-follow-along/cart')} 
              className="text-white hover:text-gray-200 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingCart size={22} />
            </motion.button>
            <motion.button 
              onClick={() => navigate('/ecommerce-follow-along/profile')}
              className="text-white hover:text-gray-200 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <User size={22} />
            </motion.button>
          </motion.div>
        </motion.nav>

        <div className="h-full overflow-hidden relative">
          <div className="h-full relative">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`absolute w-full h-full transition-opacity duration-500 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="bg-gradient-to-r from-black/50 to-transparent absolute inset-0 z-10" />
                <img
                  src={slide.image}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          <motion.div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {slides.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlide 
                    ? 'bg-white w-6' 
                    : 'bg-white/50 hover:bg-white/80'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default MakersVaultHero;