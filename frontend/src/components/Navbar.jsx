import { useState } from 'react';
import { ShoppingBag, Menu, X, Search, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <nav className="top-0 left-0 w-full bg-transparent shadow-sm z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center relative">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/ecommerce-follow-along/home" className="text-2xl font-bold text-gray-800 tracking-tight">
            Makers Vault
          </Link>
        </div>

        {/* Navigation and Actions - Right Side */}
        <div className="hidden md:flex items-center space-x-6">
          <button 
            onClick={toggleSearch}
            className="text-gray-700 hover:text-gray-900 transition-all duration-300"
          >
            <Search size={22} className="transform hover:scale-110" />
          </button>
          <NavLink to="/ecommerce-follow-along/home">Home</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/ecommerce-follow-along/profile">Profile</NavLink>
          <Link to="/wishlist" className="relative group">
            <Heart 
              size={22} 
              className="text-gray-700 hover:text-gray-900 transition-all duration-300 transform hover:scale-110" 
            />
            <span className="absolute -top-2 -right-2 bg-gray-800 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              0
            </span>
          </Link>
          <CartIcon />
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center space-x-4">
          <button 
            onClick={toggleSearch}
            className="text-gray-700 hover:text-gray-900 transition-all duration-300"
          >
            <Search size={22} />
          </button>
          <Link to="/wishlist" className="relative">
            <Heart size={22} className="text-gray-700" />
            <span className="absolute -top-2 -right-2 bg-gray-800 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              0
            </span>
          </Link>
          <CartIcon />
          <button
            onClick={toggleMenu}
            className="text-gray-800 hover:text-gray-900 transition-colors duration-300"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Centered Search Input - Only visible when search is active */}
        {isSearchOpen && (
          <div className="hidden md:block absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 w-96">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                autoFocus
              />
              <X 
                size={20} 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600"
                onClick={toggleSearch}
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg animate-slide-down">
          <div className="container mx-auto px-4 py-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                autoFocus
              />
              <X 
                size={20} 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600"
                onClick={toggleSearch}
              />
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg md:hidden animate-slide-down">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <NavLink to="/ecommerce-follow-along/home" mobile>
              Home
            </NavLink>
            <NavLink to="/about" mobile>
              About
            </NavLink>
            <NavLink to="/ecommerce-follow-along/profile" mobile>
              Profile
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
};

function NavLink({ to, children, mobile = false }) {
  return (
    <Link
      to={to}
      className={`
        text-gray-700 hover:text-gray-900
        transition-all duration-300
        relative group
        ${mobile ? 'block py-2 border-b' : ''}
      `}
    >
      <span className="relative">
        {children}
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-800 group-hover:w-full transition-all duration-300"></span>
      </span>
    </Link>
  );
}

function CartIcon() {
  return (
    <div className="relative group">
      <ShoppingBag
        size={24}
        className="text-gray-700 hover:text-gray-900 transition-colors duration-300 cursor-pointer transform hover:scale-110"
      />
      <span className="absolute -top-2 -right-2 bg-gray-800 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
        0
      </span>
    </div>
  );
}

export default Navbar;