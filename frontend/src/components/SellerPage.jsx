"use client"

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, X } from "lucide-react";
import axios from "axios";
import Footer from "./Footer";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
}

export default function SellerPage() {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const [image, setImage] = useState(null);
  const [products, setProducts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();
  const [activeNavItem, setActiveNavItem] = useState('');
  const navItems = ["Home", "Lifestyle", "Shoes", "Perfume"];

  const categories = ["clothing", "perfume", "shoe"];
  const subcategories = ["men", "women", "unisex"];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
        const response = await axios.get("http://localhost:3000/items/products");
        // Sort products to maintain consistent order
        const sortedProducts = response.data.sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
        );
        setProducts(sortedProducts);
    } catch (error) {
        setError("Error fetching products");
        console.error("Fetch error:", error);
    }
};

const onSubmit = async (data) => {
  setIsSubmitting(true);
  setError("");

  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
  });

  if (image) {
      formData.append("image", image);
  }

  try {
      let response;
      if (editingProduct) {
          console.log('Updating product:', editingProduct._id);
          response = await axios.put(
              `http://localhost:3000/items/products/${editingProduct._id}`,
              formData,
              { headers: { "Content-Type": "multipart/form-data" } }
          );
      } else {
          response = await axios.post(
              "http://localhost:3000/items/products",
              formData,
              { headers: { "Content-Type": "multipart/form-data" } }
          );
      }

      console.log('Server Response:', response.data);
      await fetchProducts();
      resetForm();
  } catch (error) {
      console.error("Error details:", error.response?.data);
      setError(error.response?.data?.message || "Error saving product");
  } finally {
      setIsSubmitting(false);
  }
};


  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      // Create local preview URL
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setValue("name", product.name);
    setValue("description", product.description);
    setValue("price", product.price);
    setValue("category", product.category);
    setValue("subcategory", product.subcategory);
    // Use Cloudinary URL directly
    setPreviewImage(product.imageUrl);
    setImage(null)
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`http://localhost:3000/items/products/${productId}`);
      await fetchProducts();
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    } catch (error) {
      setError("Error deleting product");
    }
  };

  const resetForm = () => {
    reset();
    setImage(null);
    setPreviewImage(null);
    setEditingProduct(null);
  };

  const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, productName }) => (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-lg p-6 max-w-sm w-full">
          <h3 className="text-lg font-medium mb-4">Delete Product</h3>
          <p className="text-gray-600 mb-6">Are you sure you want to delete "{productName}"? This action cannot be undone.</p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeIn} className="min-h-screen bg-gray-50">
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

      <div className="min-h-screen bg-gray-50 text-gray-900 py-6 px-4 sm:px-6 lg:px-8 pt-32">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-4xl font-light mb-12 text-center uppercase">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-sm mb-6">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form Section */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white p-6 rounded-lg shadow-sm">
              {/* Name field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2 uppercase">
                  Product Name
                </label>
                <input
                  id="name"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-colors"
                  {...register("name", { required: "Product name is required" })}
                  placeholder="Enter product name"
                />
                {errors.name && <span className="text-red-600 text-sm mt-1">{errors.name.message}</span>}
              </div>

              {/* Description field */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-2 uppercase">
                  Description
                </label>
                <textarea
                  id="description"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-colors"
                  {...register("description", { required: "Description is required" })}
                  placeholder="Enter product description"
                  rows={4}
                />
                {errors.description && <span className="text-red-600 text-sm mt-1">{errors.description.message}</span>}
              </div>

              {/* Price field */}
              <div>
                <label htmlFor="price" className="block text-sm font-medium mb-2 uppercase">
                  Price
                </label>
                <input
                  id="price"
                  type="number"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-colors"
                  {...register("price", {
                    required: "Price is required",
                    min: { value: 0, message: "Price must be positive" },
                  })}
                  placeholder="Enter price"
                  step="0.01"
                />
                {errors.price && <span className="text-red-600 text-sm mt-1">{errors.price.message}</span>}
              </div>

              {/* Category field */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium mb-2 uppercase">
                  Category
                </label>
                <select
                  id="category"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-colors"
                  {...register("category", { required: "Category is required" })}
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
                {errors.category && <span className="text-red-600 text-sm mt-1">{errors.category.message}</span>}
              </div>

              {/* Subcategory field */}
              <div>
                <label htmlFor="subcategory" className="block text-sm font-medium mb-2 uppercase">
                  Subcategory
                </label>
                <select
                  id="subcategory"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-colors"
                  {...register("subcategory", { required: "Subcategory is required" })}
                >
                  <option value="">Select Subcategory</option>
                  {subcategories.map((subcategory) => (
                    <option key={subcategory} value={subcategory}>
                      {subcategory.charAt(0).toUpperCase() + subcategory.slice(1)}
                    </option>
                  ))}
                </select>
                {errors.subcategory && <span className="text-red-600 text-sm mt-1">{errors.subcategory.message}</span>}
              </div>

              {/* Image upload field */}
              <div>
                <label htmlFor="image" className="block text-sm font-medium mb-2 uppercase">
                  Product Image
                </label>
                <input
                  id="image"
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-colors file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                />
                {previewImage && (
                  <div className="mt-4 relative">
                    <img 
                      src={previewImage} 
                      alt="Preview" 
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImage(null);
                        setPreviewImage(null);
                      }}
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>

              {/* Submit buttons */}
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed uppercase"
                >
                  {isSubmitting ? "Saving..." : (editingProduct ? "Update Product" : "Create Product")}
                </button>
                {editingProduct && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors uppercase"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            {/* Products List Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-medium mb-6 uppercase">Your Products</h2>
              <div className="space-y-6">
                {products.map((product) => (
                  <div key={product._id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <img
                      src={product.imageUrl} // Using Cloudinary URL directly
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-gray-600">${parseFloat(product.price).toFixed(2)}</p>
                      <p className="text-gray-500 text-sm">
                        {product.category} • {product.subcategory}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        <Pencil size={20} />
                      </button>
                      <button
                        onClick={() => {
                          setProductToDelete(product);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-2 text-red-600 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
                {products.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    No products added yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={() => handleDelete(productToDelete?._id)}
        productName={productToDelete?.name}
      />
      
      <div className="mt-24">
        <Footer />
      </div>
    </motion.div>
  );
}