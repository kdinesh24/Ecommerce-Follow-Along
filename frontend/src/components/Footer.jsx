import { useState } from 'react';
import { Instagram, Linkedin, Facebook, Youtube, ChevronUp, ChevronDown } from 'lucide-react';

const NavLink = ({ href, children }) => (
  <a 
    href={href} 
    className="group relative text-gray-100 hover:text-white transition-colors"
  >
    <span>{children}</span>
    <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
  </a>
);

const Footer = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="px-4 sm:px-2">
      <footer className="bg-black text-gray-100 py-8 px-8 rounded-[2rem] w-full max-w-[1450px] mx-auto relative transition-all duration-500 ease-in-out">
        {/* Expand/Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute top-8 right-8 p-2 bg-zinc-900 rounded-full hover:bg-zinc-800 transition-colors"
          aria-label={isExpanded ? "Collapse footer" : "Expand footer"}
        >
          {isExpanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
        </button>

        <div className="max-w-7xl mx-auto">
          {/* Basic Footer Content - Always Visible */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex items-center space-x-8">
              {/* Logo */}
              <div className="bg-white rounded-lg px-3 py-1.5">
                <span className="text-black font-bold text-lg">MV</span>
              </div>
              
              {/* Social Icons */}
              <div className="flex space-x-4">
                <a href="#" className="p-2 bg-zinc-900 rounded-lg hover:bg-zinc-800">
                  <Instagram size={20} />
                </a>
                <a href="#" className="p-2 bg-zinc-900 rounded-lg hover:bg-zinc-800">
                  <Linkedin size={20} />
                </a>
                <a href="#" className="p-2 bg-zinc-900 rounded-lg hover:bg-zinc-800">
                  <Facebook size={20} />
                </a>
                <a href="#" className="p-2 bg-zinc-900 rounded-lg hover:bg-zinc-800">
                  <Youtube size={20} />
                </a>
              </div>
            </div>

            {/* Basic Info */}
            <div className="mt-4 mr-12 md:mt-0">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 border border-gray-400 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 border-2 border-gray-400 rounded-full"/>
                </div>
                <span>Designed in Austria, Europe</span>
              </div>
            </div>
          </div>

          {/* Expandable Content */}
          <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
            isExpanded ? 'max-h-[2000px] opacity-100 mt-8' : 'max-h-0 opacity-0'
          }`}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-8 border-t border-zinc-800">
              {/* Navigation Links */}
              <div>
                <ul className="space-y-4 text-lg">
                  <li><NavLink href="#">Technology</NavLink></li>
                  <li><NavLink href="#">Company</NavLink></li>
                  <li><NavLink href="#">Shop</NavLink></li>
                  <li><NavLink href="#">Commercial</NavLink></li>
                  <li><NavLink href="#">Blog</NavLink></li>
                  <li><NavLink href="#">Contact</NavLink></li>
                </ul>
              </div>

              <div>
                <ul className="space-y-4 text-grey">
                  <li><NavLink href="#">Shipping & Delivery</NavLink></li>
                  <li><NavLink href="#">Privacy Policy</NavLink></li>
                  <li><NavLink href="#">Revocation</NavLink></li>
                  <li><NavLink href="#">Terms & Conditions</NavLink></li>
                  <li><NavLink href="#">Imprint</NavLink></li>
                  <li><NavLink href="#">Press kit</NavLink></li>
                </ul>
              </div>

              {/* Additional Info */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">€</span>
                  <span>100-day money-back guarantee</span>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 border border-gray-400 rounded-full flex items-center justify-center">
                    🌍
                  </div>
                  <span>Global express shipping</span>
                </div>
              </div>

              {/* Legal Text */}
              <div className="text-sm text-gray-500">
                <p>These statements have not been evaluated by the Food and Drug Administration. In the European Union, the intended use of our products does not fall within the scope or article 2 section 1 of 2017/45 MDR.</p>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mt-8 flex flex-wrap gap-4 items-center justify-center">
              <img src="/api/placeholder/80/32" alt="PayPal" className="h-8" />
              <img src="/api/placeholder/80/32" alt="Mastercard" className="h-8" />
              <img src="/api/placeholder/80/32" alt="Visa" className="h-8" />
              <img src="/api/placeholder/80/32" alt="American Express" className="h-8" />
              <img src="/api/placeholder/80/32" alt="Klarna" className="h-8" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;