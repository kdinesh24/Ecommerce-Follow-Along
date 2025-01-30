import { useState } from "react"
import { useNavigate } from "react-router-dom"

const SignupPage = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate("/ecommerce-follow-along/home")
  }

  const handleGoogleSignup = (e) => {
    e.preventDefault()
    window.location.href = 'http://localhost:3000/auth/google';
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-10 space-y-8 transform transition duration-300 hover:shadow-4xl">
        <div className="text-center">
          <h2 className="mt-6 text-4xl font-bold text-black tracking-tight animate-pulse-soft">
            Makers Vault
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Create Your Account
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-2 block w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-black text-black placeholder-gray-500 transition duration-300"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-2 block w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-black text-black placeholder-gray-500 transition duration-300"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-2 block w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-black text-black placeholder-gray-500 transition duration-300"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition duration-300 transform hover:scale-105 active:scale-95"
          >
            Sign Up
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignup}
            className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition duration-300"
          >
            <img 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
              alt="Google logo" 
              className="w-5 h-5 mr-2"
            />
            Sign up with Google
          </button>

          <div className="text-center">
            <span className="text-gray-600 text-sm">
              Already have an account?{" "}
              <a onClick={() => navigate("/ecommerce-follow-along")} className="text-black hover:underline transition duration-300 cursor-pointer">
                Log In
              </a>
            </span>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignupPage
