import { useState } from "react"
import { useNavigate } from "react-router-dom"

const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate("/ecommerce-follow-along/home")
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-10 space-y-8 transform transition duration-300 hover:shadow-4xl">
        <div className="text-center">
          <h2 className="mt-6 text-4xl font-bold text-black tracking-tight animate-pulse-soft">
            Digital Horizon
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Secure Access to Your Digital Experience
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
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
          <div className="flex justify-end">
            <a href="#" className="text-sm text-black hover:underline transition duration-300">
              Forgot Password?
            </a>
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition duration-300 transform hover:scale-105 active:scale-95"
          >
            Sign In
          </button>
          <div className="text-center">
            <span className="text-gray-600 text-sm">
              Don't have an account?{" "}
              <a href="#" className="text-black hover:underline transition duration-300">
                Sign Up
              </a>
            </span>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginPage