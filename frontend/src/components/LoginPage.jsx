import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { Eye, EyeOff } from 'lucide-react'
import LoginOptionsModal from './LoginOptionsModal'
import { motion, AnimatePresence } from "framer-motion"

const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [tempLoginData, setTempLoginData] = useState(null)
  const navigate = useNavigate()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  const buttonVariants = {
    hover: { scale: 1.02 },
    tap: { scale: 0.98 }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await axios.post('http://localhost:3000/users/login', {
        email,
        password
      }, {
        withCredentials: true
      })
      
      if (response.status === 200) {
        // Ensure the token is set correctly
        localStorage.setItem('token', response.data.token);
        

        // If user is a seller, show the modal and store response temporarily
        if (response.data.user.isSeller) {
          setTempLoginData(response.data)
          setIsModalOpen(true)
        } else {
          // If not a seller, login directly as customer
          const userData = {
            ...response.data.user,
            currentRole: 'customer'
          }
          localStorage.setItem('userData', JSON.stringify(userData))
          navigate("/ecommerce-follow-along/home")
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      alert(error.response?.data?.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRoleSelect = (role) => {
    setIsModalOpen(false)
    
    if (tempLoginData) {
      const userData = {
        ...tempLoginData.user,
        currentRole: role
      }
      localStorage.setItem('userData', JSON.stringify(userData))
     
      navigate("/ecommerce-follow-along/home")
    }
  }

  const handleGoogleLogin = (e) => {
    e.preventDefault()
    window.location.href = 'http://localhost:3000/auth/google'
  }

  return (
    <motion.div 
      className="min-h-screen flex"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatePresence>
      {isModalOpen && (
        <LoginOptionsModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSelectRole={handleRoleSelect}
        />
      )}
      </AnimatePresence>
      
      {/* Left Section */}
      <div className="w-1/2 bg-white p-8 flex items-center justify-center">
        <motion.div 
          className="w-full max-w-md"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Logo */}
          <motion.div className="mb-8" variants={itemVariants}>
            <img src="/path-to-your-logo.svg" alt="CubeFactory" className="h-8" />
          </motion.div>

          {/* Welcome Text */}
          <motion.h1 
            className="text-3xl font-bold mb-2"
            variants={itemVariants}
          >
            Welcome back
          </motion.h1>
          <motion.p 
            className="text-gray-600 mb-8"
            variants={itemVariants}
          >
            Please enter your details
          </motion.p>

          {/* Google Sign In Button */}
          <motion.button
            variants={{ ...itemVariants, ...buttonVariants }}
            whileHover="hover"
            whileTap="tap"
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-md py-3 mb-4 hover:bg-gray-50 transition-colors"
            disabled={isLoading}
          >
            <img 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
              alt="Google logo" 
              className="w-5 h-5"
            />
            Sign in with Google
          </motion.button>

          {/* Divider */}
          <motion.div className="relative my-6" variants={itemVariants}>
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </motion.div>

          {/* Login Form */}
          <motion.form 
            onSubmit={handleSubmit} 
            className="space-y-4"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <label className="block text-sm mb-2">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
                disabled={isLoading}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </motion.div>

            <motion.div 
              className="flex items-center justify-end"
              variants={itemVariants}
            >
              <a href="#" className="text-sm text-blue-500 hover:underline">
                Forgot password?
              </a>
            </motion.div>

            <motion.button
              variants={{ ...itemVariants, ...buttonVariants }}
              whileHover="hover"
              whileTap="tap"
              type="submit"
              className="w-full bg-black text-white rounded-md py-3 hover:bg-gray-800 transition-colors disabled:bg-gray-400"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </motion.button>
          </motion.form>

          <motion.p 
            className="mt-6 text-center text-sm text-gray-600"
            variants={itemVariants}
          >
            Don't have an account?{" "}
            <a
              onClick={() => navigate("/ecommerce-follow-along/signup")}
              className="text-blue-500 hover:underline cursor-pointer"
            >
              Sign up
            </a>
          </motion.p>
        </motion.div>
      </div>

      {/* Right Section - Hero Image */}
      <motion.div 
        className="w-1/2 relative"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="absolute inset-0 bg-cover bg-center" style={{
          backgroundImage: "url('https://diorama.dam-broadcast.com/cdn-cgi/image/width=640,format=auto/pm_11872_985_985075-y4fftof333-whr.jpg')"
        }}>
          <motion.div 
            className="absolute bottom-16 left-16 text-white"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            <h2 className="text-4xl font-bold mb-4">Bring your ideas to life.</h2>
            <p className="text-xl">
              Sign up for free and enjoy access to all features<br />
              for 30 days. No credit card required.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default LoginPage