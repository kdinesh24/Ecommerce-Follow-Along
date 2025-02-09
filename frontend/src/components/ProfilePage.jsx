import { useState, useEffect } from "react";
import { 
  Settings, 
  Package, 
  CreditCard, 
  User, 
  LogOut,
  ChevronRight
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    isSeller: false,
    currentRole: 'customer'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    checkAuthAndFetchProfile();
  }, []);

  const checkAuthAndFetchProfile = async () => {
    try {
      setIsLoading(true);
      
      // First, check if we have userData in localStorage
      const storedUserData = localStorage.getItem('userData');
      if (!storedUserData) {
        throw new Error('No stored user data');
      }

      const userDataFromStorage = JSON.parse(storedUserData);

      // Try to make an authenticated request to verify the session
      const response = await axios.post('http://localhost:3000/users/login', {
        email: userDataFromStorage.email,
        password: userDataFromStorage.password || '' // Include if you stored it
      }, {
        withCredentials: true
      });

      if (response.data && response.data.user) {
        // Update formData with the combination of server data and stored preferences
        setFormData({
          name: response.data.user.name || userDataFromStorage.name || '',
          email: response.data.user.email || userDataFromStorage.email || '',
          isSeller: response.data.user.isSeller || userDataFromStorage.isSeller || false,
          currentRole: userDataFromStorage.currentRole || 'customer'
        });

        // Update localStorage with fresh data while preserving role
        const updatedData = {
          ...response.data.user,
          currentRole: userDataFromStorage.currentRole
        };
        localStorage.setItem('userData', JSON.stringify(updatedData));
      } else {
        throw new Error('Invalid response from server');
      }

    } catch (err) {
      console.error('Auth check error:', err);
      setError(err.message);
      // Only navigate to login if there's no valid stored data
      if (!localStorage.getItem('userData')) {
        navigate('/ecommerce-follow-along/login');
      } else {
        // Use stored data as fallback
        const fallbackData = JSON.parse(localStorage.getItem('userData'));
        setFormData({
          name: fallbackData.name || '',
          email: fallbackData.email || '',
          isSeller: fallbackData.isSeller || false,
          currentRole: fallbackData.currentRole || 'customer'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3000/users/logout', {}, {
        withCredentials: true
      });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Always clear localStorage and redirect
      localStorage.removeItem('userData');
      navigate('/ecommerce-follow-along/login');
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
      setSaveStatus('Saving...');
      
      // First update localStorage
      const currentStoredData = JSON.parse(localStorage.getItem('userData') || '{}');
      const updatedData = {
        ...currentStoredData,
        name: formData.name,
        email: formData.email
      };
      localStorage.setItem('userData', JSON.stringify(updatedData));
      
      // Then try to update server
      try {
        const response = await axios.put('http://localhost:3000/users/update-profile', {
          name: formData.name,
          email: formData.email
        }, {
          withCredentials: true
        });

        if (response.data && response.data.user) {
          // Update localStorage with server response while preserving role
          const serverUpdatedData = {
            ...response.data.user,
            currentRole: updatedData.currentRole
          };
          localStorage.setItem('userData', JSON.stringify(serverUpdatedData));
        }
      } catch (serverError) {
        console.warn('Server update failed, using localStorage only:', serverError);
      }

      setSaveStatus('Changes saved successfully!');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (err) {
      console.error('Save error:', err);
      setSaveStatus('Failed to save changes');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  const handleSwitchRole = () => {
    const newRole = formData.currentRole === 'seller' ? 'customer' : 'seller';
    
    // Update localStorage
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const updatedData = {
      ...userData,
      currentRole: newRole
    };
    localStorage.setItem('userData', JSON.stringify(updatedData));
    
    setFormData(prev => ({
      ...prev,
      currentRole: newRole
    }));
  };

  const getUserTypeDisplay = () => {
    if (!formData.isSeller) {
      return 'Customer';
    }
    return formData.currentRole === 'seller' ? 'Seller' : 'Customer';
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
      {/* Navigation Bar */}
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32">
        <div className="flex gap-8">
          {/* Left Sidebar */}
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
                <p className="text-sm font-medium text-black mt-2 text-center bg-gray-100 rounded-full py-1">
                  {getUserTypeDisplay()}
                </p>
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

          {/* Main Form */}
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
                        You are currently logged in as a {getUserTypeDisplay()}
                      </p>
                      {formData.isSeller && (
                        <p className="text-sm text-gray-500 mt-1">
                          {formData.currentRole === 'customer' 
                            ? "Switch to seller mode to access your seller dashboard"
                            : "Switch to customer mode to shop"}
                        </p>
                      )}
                    </div>
                    {formData.isSeller && (
                      <div className="flex gap-2">
                        <button
                          onClick={handleSwitchRole}
                          className="px-4 py-2 text-sm font-medium text-black bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                        >
                          Switch to {formData.currentRole === 'seller' ? 'Customer' : 'Seller'}
                        </button>
                        {formData.currentRole === 'seller' && (
                          <button
                            onClick={() => navigate('/ecommerce-follow-along/seller')}
                            className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-900 transition-colors duration-200"
                          >
                            Seller Dashboard
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 flex items-center">
                  <button
                    onClick={handleSaveChanges}
                    className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                  >
                    Save Changes
                  </button>
                  {saveStatus && (
                    <span className={`ml-4 text-sm ${saveStatus.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                      {saveStatus}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}