import { useState, useEffect } from "react";
import { 
  Settings, 
  Package, 
  CreditCard, 
  User, 
  LogOut,
  ChevronRight,
  Shield
} from "lucide-react";
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    isSeller: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuthAndFetchProfile();
  }, []);

  const checkAuthAndFetchProfile = async () => {
    try {
      console.log('Checking authentication...');
      const response = await fetch('/check-auth', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Auth response status:', response.status);

      if (!response.ok) {
        throw new Error('Not authenticated');
      }

      const data = await response.json();
      console.log('Auth data:', data);

      setFormData({
        name: data.user.name || '',
        email: data.user.email || '',
        isSeller: data.user.isSeller || false
      });
    } catch (err) {
      console.error('Auth check error:', err);
      if (err.message === 'Not authenticated') {
        navigate('/ecommerce-follow-along/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch('http://localhost:3000/auth/update-profile', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      
      setFormData(prevData => ({
        ...prevData,
        name: data.name,
        email: data.email
      }));
      
      alert('Profile updated successfully');
    } catch (err) {
      console.error('Update error:', err);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:3000/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      navigate('/ecommerce-follow-along/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Floating Navigation */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-white/90 backdrop-blur-md rounded-full shadow-xl p-6 border border-gray-100">
          <div className="flex items-center space-x-12">
            <button 
              onClick={() => navigate('/ecommerce-follow-along/home')}
              className="text-gray-700 hover:text-black transition-all duration-200 flex flex-col items-center group"
            >
              <span className="text-base font-semibold group-hover:scale-110 transform transition-transform">Home</span>
              <div className="h-1 w-0 group-hover:w-full bg-black mt-1 transition-all duration-200"></div>
            </button>
            
            <button 
              onClick={() => navigate('/ecommerce-follow-along/lifestyle')}
              className="text-gray-700 hover:text-black transition-all duration-200 flex flex-col items-center group"
            >
              <span className="text-base font-semibold group-hover:scale-110 transform transition-transform">Lifestyle</span>
              <div className="h-1 w-0 group-hover:w-full bg-black mt-1 transition-all duration-200"></div>
            </button>
            
            <button 
              onClick={() => navigate('/ecommerce-follow-along/shoes')}
              className="text-gray-700 hover:text-black transition-all duration-200 flex flex-col items-center group"
            >
              <span className="text-base font-semibold group-hover:scale-110 transform transition-transform">Shoes</span>
              <div className="h-1 w-0 group-hover:w-full bg-black mt-1 transition-all duration-200"></div>
            </button>
            
            <button 
              onClick={() => navigate('/ecommerce-follow-along/perfume')}
              className="text-gray-700 hover:text-black transition-all duration-200 flex flex-col items-center group"
            >
              <span className="text-base font-semibold group-hover:scale-110 transform transition-transform">Perfume</span>
              <div className="h-1 w-0 group-hover:w-full bg-black mt-1 transition-all duration-200"></div>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content with Enhanced Design */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32">
        <div className="flex gap-8">
          {/* Enhanced Left Sidebar */}
          <div className="w-72">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="w-20 h-20 bg-black rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 text-center">{formData.name}</h2>
                <p className="text-sm text-gray-500 mt-1 text-center">{formData.email}</p>
              </div>
              
              <nav className="space-y-2 p-4">
                <button className="flex items-center w-full px-6 py-4 text-sm font-medium text-black bg-gray-50 rounded-xl border-l-4 border-black">
                  <User className="w-5 h-5 mr-3" />
                  Personal Info
                  <ChevronRight className="w-5 h-5 ml-auto" />
                </button>
                
                <button className="flex items-center w-full px-6 py-4 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl hover:text-black transition-colors duration-200">
                  <Package className="w-5 h-5 mr-3" />
                  Orders
                  <ChevronRight className="w-5 h-5 ml-auto" />
                </button>
                
                <button className="flex items-center w-full px-6 py-4 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl hover:text-black transition-colors duration-200">
                  <CreditCard className="w-5 h-5 mr-3" />
                  Payment Methods
                  <ChevronRight className="w-5 h-5 ml-auto" />
                </button>
                
                <button className="flex items-center w-full px-6 py-4 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl hover:text-black transition-colors duration-200">
                  <Settings className="w-5 h-5 mr-3" />
                  Settings
                  <ChevronRight className="w-5 h-5 ml-auto" />
                </button>
              </nav>
              
              <div className="p-6">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Main Form */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="pb-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                <p className="mt-2 text-gray-500">Update your personal details and account settings</p>
              </div>

              <div className="mt-8">
                <div className="space-y-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black transition-colors duration-200"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black transition-colors duration-200"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">Account Type</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        You are currently a {formData.isSeller ? 'Seller' : 'Buyer'} account
                      </p>
                    </div>
                    {formData.isSeller && (
                      <button
                        onClick={() => navigate('/ecommerce-follow-along/seller')}
                        className="px-4 py-2 text-sm font-medium text-black bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                      >
                        Go to Seller Dashboard
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    onClick={handleSaveChanges}
                    className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}