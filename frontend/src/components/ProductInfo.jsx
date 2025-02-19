"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { ShoppingBag, Heart, Share2, ArrowLeft } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "react-hot-toast"
import Footer from "./Footer"

export default function ProductInfo() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isFavorite, setIsFavorite] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [showShareAlert, setShowShareAlert] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/items/products/${id}`)
        setProduct(response.data)
        
        
        const token = localStorage.getItem("token")
        if (token) {
          const wishlistResponse = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/wishlist`,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              withCredentials: true
            }
          )
          setIsFavorite(wishlistResponse.data.some(item => item._id === id))
        }
      } catch (error) {
        console.error("Error fetching product details:", error)
        setError("Error fetching product details")
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  const handleAddToCart = async () => {
    if (!product?.inStock) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate('/ecommerce-follow-along/login');
        toast.error('Please login to add items to cart');
        return;
      }

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/cart/add`,
        { productId: id, quantity: 1 },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );
      
      toast.success('Added to cart');
    } catch (error) {
      console.error("Error adding to cart:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/ecommerce-follow-along/login');
        toast.error('Please login again to add items to cart');
      } else {
        toast.error('Failed to add item to cart');
      }
    }
  };

  const handleToggleFavorite = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate('/ecommerce-follow-along/login');
        toast.error('Please login to add items to wishlist');
        return;
      }

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/wishlist/toggle`,
        { productId: id },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      setIsFavorite(!isFavorite);
      toast.success(isFavorite ? 'Removed from wishlist' : 'Added to wishlist');
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/ecommerce-follow-along/login');
        toast.error('Please login again to update wishlist');
      } else {
        toast.error('Failed to update wishlist');
      }
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    setShowShareAlert(true)
    setTimeout(() => setShowShareAlert(false), 3000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="w-16 h-16 border-4 border-white border-t-transparent rounded-full"
        />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 text-center space-y-4"
        >
          <p className="text-xl">{error || "Product not found"}</p>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-white px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <>
      <AnimatePresence>
        {showShareAlert && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg"
          >
            Product link copied to clipboard!
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Product Image Section */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100">
                <motion.img
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  src={Array.isArray(product.imageUrl) ? product.imageUrl[selectedImage] : product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute right-4 top-4 z-10 flex gap-2">
                  <motion.button
                    onClick={handleToggleFavorite}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="rounded-full bg-white p-3 shadow-lg"
                  >
                    <Heart size={24} className={isFavorite ? "fill-red-500 stroke-red-500" : "stroke-gray-600"} />
                  </motion.button>
                  <motion.button
                    onClick={handleShare}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="rounded-full bg-white p-3 shadow-lg"
                  >
                    <Share2 size={24} className="stroke-gray-600" />
                  </motion.button>
                </div>
              </div>

              {/* Thumbnail Images */}
              {Array.isArray(product.imageUrl) && (
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {product.imageUrl.map((url, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedImage(index)}
                      className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden ${
                        selectedImage === index ? "ring-2 ring-black" : ""
                      }`}
                    >
                      <img
                        src={url || "/placeholder.svg"}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Details Section */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <div className="space-y-4">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl font-bold text-gray-900"
                >
                  {product.name}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl font-semibold text-gray-900"
                >
                  ${product.price.toFixed(2)}
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="prose prose-lg text-gray-600"
              >
                {product.description}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-2"
              >
                {[product.category, product.subcategory].map((tag, index) => (
                  <motion.span
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="px-4 py-2 text-sm font-medium bg-gray-100 text-gray-800 rounded-full"
                  >
                    {tag}
                  </motion.span>
                ))}
              </motion.div>

              {/* Action Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className={`w-full py-4 px-8 rounded-full flex items-center justify-center gap-2 text-lg font-medium transition-colors ${
                    product.inStock 
                      ? 'bg-black text-white hover:bg-zinc-800' 
                      : 'bg-gray-400 text-white cursor-not-allowed'
                  }`}
                  disabled={!product.inStock}
                >
                  <ShoppingBag size={20} />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </motion.button>
              </motion.div>

              {/* Additional Product Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="border-t pt-8 space-y-4"
              >
                <h3 className="text-lg font-semibold">Product Details</h3>
                <dl className="space-y-4">
                  {product.details &&
                    Object.entries(product.details).map(([key, value]) => (
                      <div key={key} className="flex">
                        <dt className="w-1/3 text-gray-600">{key}:</dt>
                        <dd className="w-2/3 text-gray-900">{value}</dd>
                      </div>
                    ))}
                </dl>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
        <Footer />
      </div>
    </>
  )
}