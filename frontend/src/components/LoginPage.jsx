import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { Eye, EyeOff } from 'lucide-react'

const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:3000/users/login', {
        email,
        password
      }, {
        withCredentials: true
      })
      
      if (response.status === 200) {
        navigate("/ecommerce-follow-along/home")
      }
    } catch (error) {
      console.error('Login error:', error)
      alert(error.response?.data?.msg || 'Login failed')
    }
  }

  const handleGoogleLogin = (e) => {
    e.preventDefault()
    window.location.href = 'http://localhost:3000/auth/google'
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Section */}
      <div className="w-1/2 bg-white p-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8">
            <img src="/path-to-your-logo.svg" alt="CubeFactory" className="h-8" />
          </div>

          {/* Welcome Text */}
          <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
          <p className="text-gray-600 mb-8">Please enter your details</p>

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-md py-3 mb-4 hover:bg-gray-50 transition-colors"
          >
            <img 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
              alt="Google logo" 
              className="w-5 h-5"
            />
            Sign in with Google
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">

              </div>
              <a href="#" className="text-sm text-blue-500 hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white rounded-md py-3 hover:bg-gray-800 transition-colors"
            >
              Sign in
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <a
              onClick={() => navigate("/ecommerce-follow-along/signup")}
              className="text-blue-500 hover:underline cursor-pointer"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>

      {/* Right Section - Hero Image */}
      <div className="w-1/2 relative">
        <div className="absolute inset-0 bg-cover bg-center" style={{
          backgroundImage: "url('https://diorama.dam-broadcast.com/cdn-cgi/image/width=640,format=auto/pm_11872_985_985075-y4fftof333-whr.jpg')"
        }}>
          <div className="absolute bottom-16 left-16 text-white">
            <h2 className="text-4xl font-bold mb-4">Bring your ideas to life.</h2>
            <p className="text-xl">
              Sign up for free and enjoy access to all features<br />
              for 30 days. No credit card required.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};


export default LoginPage