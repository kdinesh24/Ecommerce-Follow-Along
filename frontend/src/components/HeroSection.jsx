import { useState, useEffect } from 'react';
import { User, Search, X, Heart, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchModal = ({ isOpen, onClose }) => {
  return (
    <div 
      className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-200 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="flex items-start justify-center pt-32">
        <div className={`w-full max-w-2xl mx-4 transition-all duration-200 ${
          isOpen ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
        }`}>
          <div className="bg-white/20 backdrop-blur-md rounded-xl shadow-xl overflow-hidden border border-white/30">
            <div className="relative p-4">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full p-4 pr-12 text-lg border-none outline-none bg-transparent text-white placeholder-white/70"
                autoFocus
              />
              <button 
                onClick={onClose}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MakersVaultHero = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const slides = [
    {
      image: "https://static.zara.net/assets/public/d02c/c45c/0bb34ffeb9a1/4b93ba580a48/image-landscape-default-fill-9986cf18-578d-4734-9c1d-b1914a5743dd-default_0/image-landscape-default-fill-9986cf18-578d-4734-9c1d-b1914a5743dd-default_0.jpg?ts=1738164069159&w=1905",
    },
    {
      image: "https://images.unsplash.com/photo-1616640045164-deb3b104c4b6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      image: "https://media.wired.com/photos/672107771a715d099fb8e041/16:9/w_3840,h_2160,c_limit/Apple-MacBook-Pro-M4-lineup.png",
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

  return (
    <div className="min-h-screen bg-white p-6 lg:p-8 mb-10 flex flex-col">
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      
      <div className="w-full h-[90vh] rounded-[2rem] overflow-hidden relative">
        <nav className="absolute top-0 left-0 right-0 px-8 py-6 flex justify-between items-center z-20">
          <div className="flex items-center space-x-3">
            <div className="bg-white rounded-lg px-3 py-1.5">
              <span className="text-black font-bold text-lg">MV</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-12">
            <a 
              onClick={() => navigate('/ecommerce-follow-along/lifestyle')} 
              className="glowing-text text-white transition duration-300 cursor-pointer"
            >
              Lifestyle
            </a>
            <a href="/ecommerce-follow-along/shoes" className="glowing-text text-white transition duration-300">Shoes</a>
            <a 
              onClick={() => navigate('/ecommerce-follow-along/perfume')} 
              className="glowing-text text-white transition duration-300 cursor-pointer"
            >
              Perfumes
            </a>
            <button onClick={handleProfileClick} className="px-6 py-2 text-white border border-white-400 rounded-full hover:bg-white hover:text-black transition-colors">
              Be a seller
            </button>         
          </div>

          <div className="flex items-center space-x-6">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <Search size={22} />
            </button>

            <button 
              className="text-white hover:text-gray-200 transition-colors"
            >
              <Heart size={22} />
            </button>
            <button 
              className="text-white hover:text-gray-200 transition-colors"
            >
              <ShoppingCart size={22} />
            </button>
            <button 
              onClick={() => navigate('/ecommerce-follow-along/profile')}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <User size={22} />
            </button>
          </div>
        </nav>

        <div className="h-full overflow-hidden">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="bg-gradient-to-r from-black/50 to-transparent z-10" />
              <div className="w-full h-full flex items-center justify-center">
                <img
                  src={slide.image}
                  alt="Slide"
                />
              </div>
            </div>
          ))}

          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlide 
                    ? 'bg-white w-6' 
                    : 'bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


export default MakersVaultHero;