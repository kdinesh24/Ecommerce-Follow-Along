import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const SignupPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    isSeller: false
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    // Clear error when user starts typing
    if (error) setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await axios.post('http://localhost:3000/users/signup', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      if (response.data.success) {
        navigate("/ecommerce-follow-along/login")
      }
    } catch (error) {
      console.error('Signup error:', error)
      if (error.response?.status === 409) {
        setError("This email is already registered. Please try logging in instead.")
      } else if (error.response?.data?.message) {
        setError(error.response.data.message)
      } else {
        setError("An error occurred during signup. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = (e) => {
    e.preventDefault()
    window.location.href = 'http://localhost:3000/auth/google'
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Section */}
      <div className="w-1/2 p-8 flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto">
          <img src="/logo.png" alt="Logo" className="h-8 mb-12" />
          <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
          <p className="text-gray-600 mb-8">Please enter your details</p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleGoogleSignup}
            className="w-full mb-4 flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-3 px-4 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <img 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
              alt="Google logo" 
              className="w-5 h-5"
            />
            Sign in with Google
          </button>

          <div className="flex items-center gap-4 my-8">
            <div className="h-px bg-gray-300 flex-1"></div>
            <span className="text-gray-500 text-sm">or</span>
            <div className="h-px bg-gray-300 flex-1"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isSeller"
                name="isSeller"
                checked={formData.isSeller}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isSeller" className="ml-2 block text-sm text-gray-700">
                Register as a seller
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-black text-white rounded-lg py-3 font-medium transition-colors ${
                loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-gray-800'
              }`}
            >
              {loading ? 'Signing up...' : 'Sign up'}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600 text-sm">
            Already have an account?{" "}
            <a 
              onClick={() => navigate("/ecommerce-follow-along/login")} 
              className="text-blue-500 hover:underline cursor-pointer"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-1/2 bg-gray-100 relative">
        <div className="absolute inset-0 bg-cover bg-center" style={{ 
          backgroundImage: `url('https://diorama.dam-broadcast.com/cdn-cgi/image/width=640,format=auto/pm_11872_985_985087-qgqb39t1m0-whr.jpg')`
        }}>
          <div className="absolute bottom-16 left-8 right-8 text-white">
            <h2 className="text-4xl font-bold mb-4">Bring your ideas to life.</h2>
            <p className="text-lg">
              Sign up for free and enjoy access to all features for 30 days. No credit card required.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignupPage