"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Settings, Package, CreditCard, User, LogOut, ChevronRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
}

const slideIn = {
  hidden: { x: -20, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.5 } },
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const [activeNavItem, setActiveNavItem] = useState('')
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    isSeller: false,
    currentRole: "customer",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saveStatus, setSaveStatus] = useState("")

  useEffect(() => {
    checkAuthAndFetchProfile()
  }, [])

  const checkAuthAndFetchProfile = async () => {
    try {
      setIsLoading(true)

      const storedUserData = localStorage.getItem("userData")
      if (!storedUserData) {
        throw new Error("No stored user data")
      }

      const userDataFromStorage = JSON.parse(storedUserData)

      const response = await axios.post(
        "http://localhost:3000/users/login",
        {
          email: userDataFromStorage.email,
          password: userDataFromStorage.password || "",
        },
        {
          withCredentials: true,
        },
      )

      if (response.data && response.data.user) {
        setFormData({
          name: response.data.user.name || userDataFromStorage.name || "",
          email: response.data.user.email || userDataFromStorage.email || "",
          isSeller: response.data.user.isSeller || userDataFromStorage.isSeller || false,
          currentRole: userDataFromStorage.currentRole || "customer",
        })

        const updatedData = {
          ...response.data.user,
          currentRole: userDataFromStorage.currentRole,
        }
        localStorage.setItem("userData", JSON.stringify(updatedData))
      } else {
        throw new Error("Invalid response from server")
      }
    } catch (err) {
      console.error("Auth check error:", err)
      setError(err.message)
      if (!localStorage.getItem("userData")) {
        navigate("/ecommerce-follow-along/login")
      } else {
        const fallbackData = JSON.parse(localStorage.getItem("userData"))
        setFormData({
          name: fallbackData.name || "",
          email: fallbackData.email || "",
          isSeller: fallbackData.isSeller || false,
          currentRole: fallbackData.currentRole || "customer",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/users/logout",
        {},
        {
          withCredentials: true,
        },
      )
    } catch (err) {
      console.error("Logout error:", err)
    } finally {
      localStorage.removeItem("userData")
      navigate("/ecommerce-follow-along/login")
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSaveChanges = async () => {
    try {
      setSaveStatus("Saving...")

      const currentStoredData = JSON.parse(localStorage.getItem("userData") || "{}")
      const updatedData = {
        ...currentStoredData,
        name: formData.name,
        email: formData.email,
      }
      localStorage.setItem("userData", JSON.stringify(updatedData))

      try {
        const response = await axios.put(
          "http://localhost:3000/users/update-profile",
          {
            name: formData.name,
            email: formData.email,
          },
          {
            withCredentials: true,
          },
        )

        if (response.data && response.data.user) {
          const serverUpdatedData = {
            ...response.data.user,
            currentRole: updatedData.currentRole,
          }
          localStorage.setItem("userData", JSON.stringify(serverUpdatedData))
        }
      } catch (serverError) {
        console.warn("Server update failed, using localStorage only:", serverError)
      }

      setSaveStatus("Changes saved successfully!")
      setTimeout(() => setSaveStatus(""), 3000)
    } catch (err) {
      console.error("Save error:", err)
      setSaveStatus("Failed to save changes")
      setTimeout(() => setSaveStatus(""), 3000)
    }
  }

  const handleSwitchRole = () => {
    const newRole = formData.currentRole === "seller" ? "customer" : "seller"

    const userData = JSON.parse(localStorage.getItem("userData") || "{}")
    const updatedData = {
      ...userData,
      currentRole: newRole,
    }
    localStorage.setItem("userData", JSON.stringify(updatedData))

    setFormData((prev) => ({
      ...prev,
      currentRole: newRole,
    }))
  }

  const getUserTypeDisplay = () => {
    if (!formData.isSeller) {
      return "Customer"
    }
    return formData.currentRole === "seller" ? "Seller" : "Customer"
  }

  if (isLoading) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="min-h-screen flex items-center justify-center bg-gray-50"
      >
        <div className="text-gray-600 text-xl font-semibold">Loading...</div>
      </motion.div>
    )
  }
  const navItems = ["Home", "Lifestyle", "Shoes", "Perfume"]

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeIn} className="min-h-screen bg-gray-50">
      {/* Improved Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 flex justify-center z-50 p-6">
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 100,
            damping: 20,
            duration: 0.6 
          }}
          className="bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-gray-100 px-8 py-4"
        >
          <div className="flex items-center gap-12">
            {navItems.map((item) => (
              <motion.div
                key={item}
                className="relative"
                onClick={() => {
                  setActiveNavItem(item)
                  navigate(`/ecommerce-follow-along/${item.toLowerCase()}`)
                }}
              >
                <motion.button
                  className="relative text-gray-700 hover:text-black transition-all duration-200 px-2 py-1"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-base font-medium">{item}</span>
                  {activeNavItem === item && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.button>
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-black opacity-0"
                  whileHover={{ opacity: 0.3 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>


      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32">
        <div className="flex gap-8">
          {/* Left Sidebar */}
          <motion.div className="w-72" variants={slideIn}>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100">
                <motion.div
                  className="w-20 h-20 bg-black rounded-full mx-auto mb-4 flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="text-2xl font-bold text-white">
                    {formData.name ? formData.name.charAt(0).toUpperCase() : "U"}
                  </span>
                </motion.div>
                <h2 className="text-xl font-bold text-gray-900 text-center">{formData.name}</h2>
                <p className="text-sm text-gray-500 mt-1 text-center">{formData.email}</p>
                <p className="text-sm font-medium text-black mt-2 text-center bg-gray-100 rounded-full py-1">
                  {getUserTypeDisplay()}
                </p>
              </div>

              <nav className="space-y-2 p-4">
                {[
                  { icon: User, text: "Personal Info" },
                  { icon: Package, text: "Orders" },
                  { icon: CreditCard, text: "Payment Methods" },
                  { icon: Settings, text: "Settings" },
                ].map((item, index) => (
                  <motion.button
                    key={item.text}
                    className={`flex items-center w-full px-6 py-4 text-sm font-medium ${
                      index === 0
                        ? "text-black bg-gray-50 rounded-xl border-l-4 border-black"
                        : "text-gray-600 hover:bg-gray-50 rounded-xl hover:text-black"
                    } transition-colors duration-200`}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.text}
                    <ChevronRight className="w-5 h-5 ml-auto" />
                  </motion.button>
                ))}
              </nav>

              <div className="p-6">
                <motion.button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Logout
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Main Form */}
          <motion.div className="flex-1" variants={slideIn}>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="pb-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                <p className="mt-2 text-gray-500">Update your personal details and account settings</p>
              </div>

              <div className="mt-8">
                <div className="space-y-8">
                  {["Full Name", "Email Address"].map((label, index) => (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
                      <input
                        type={index === 0 ? "text" : "email"}
                        name={index === 0 ? "name" : "email"}
                        value={formData[index === 0 ? "name" : "email"]}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black transition-colors duration-200"
                        placeholder={`Enter your ${label.toLowerCase()}`}
                      />
                    </motion.div>
                  ))}

                  <motion.div
                    className="flex items-center p-4 bg-gray-50 rounded-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">Account Type</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        You are currently logged in as a {getUserTypeDisplay()}
                      </p>
                      {formData.isSeller && (
                        <p className="text-sm text-gray-500 mt-1">
                          {formData.currentRole === "customer"
                            ? "Switch to seller mode to access your seller dashboard"
                            : "Switch to customer mode to shop"}
                        </p>
                      )}
                    </div>
                    {formData.isSeller && (
                      <div className="flex gap-2">
                        <motion.button
                          onClick={handleSwitchRole}
                          className="px-4 py-2 text-sm font-medium text-black bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Switch to {formData.currentRole === "seller" ? "Customer" : "Seller"}
                        </motion.button>
                        {formData.currentRole === "seller" && (
                          <motion.button
                            onClick={() => navigate("/ecommerce-follow-along/seller")}
                            className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-900 transition-colors duration-200"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Seller Dashboard
                          </motion.button>
                        )}
                      </div>
                    )}
                  </motion.div>
                </div>

                <motion.div
                  className="mt-8 flex items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.button
                    onClick={handleSaveChanges}
                    className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Save Changes
                  </motion.button>
                  {saveStatus && (
                    <motion.span
                      className={`ml-4 text-sm ${saveStatus.includes("success") ? "text-green-600" : "text-red-600"}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      {saveStatus}
                    </motion.span>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

