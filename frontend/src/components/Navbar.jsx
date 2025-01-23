import { useState } from 'react';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md shadow-sm z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/ecommerce-follow-along/home" className="text-2xl font-bold text-gray-800 tracking-tight">
            Digital Horizon
          </Link>
        </div>
        <div className="hidden md:flex items-center space-x-6">
          <NavLink to="/ecommerce-follow-along/home">Home</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/profile">Profile</NavLink>
          <CartIcon />
        </div>
        <div className="md:hidden flex items-center space-x-4">
          <CartIcon />
          <button
            onClick={toggleMenu}
            className="text-gray-800 hover:text-gray-900 transition-colors duration-300"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg md:hidden animate-slide-down">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <NavLink to="/ecommerce-follow-along/home" mobile>
              Home
            </NavLink>
            <NavLink to="/about" mobile>
              About
            </NavLink>
            <NavLink to="/profile" mobile>
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