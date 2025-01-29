import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import axios from "axios"

export default function ProfilePage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const [image, setImage] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    setError("")
    const formData = new FormData()
    formData.append("name", data.name)
    formData.append("description", data.description)
    formData.append("price", data.price)
    if (image) formData.append("image", image)

    try {
      await axios.post("http://localhost:3000/items/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      navigate("/ecommerce-follow-along/home")
    } catch (error) {
      setError(error.response?.data?.message || "Error creating product")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-3xl">
        <h1 className="text-4xl font-light mb-12 text-center uppercase tracking-wide">Add New Product</h1>
        {error && <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-sm mb-6">{error}</div>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2 uppercase">
              Product Name
            </label>
            <input
              id="name"
              className="w-full p-3 border border-gray-200 rounded-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-colors"
              {...register("name", { required: "Product name is required" })}
              placeholder="Enter product name"
            />
            {errors.name && <span className="text-red-600 text-sm mt-1">{errors.name.message}</span>}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2 uppercase">
              Description
            </label>
            <textarea
              id="description"
              className="w-full p-3 border border-gray-200 rounded-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-colors"
              {...register("description", { required: "Description is required" })}
              placeholder="Enter product description"
              rows={4}
            />
            {errors.description && <span className="text-red-600 text-sm mt-1">{errors.description.message}</span>}
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium mb-2 uppercase">
              Price
            </label>
            <input
              id="price"
              type="number"
              className="w-full p-3 border border-gray-200 rounded-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-colors"
              {...register("price", {
                required: "Price is required",
                min: { value: 0, message: "Price must be positive" },
              })}
              placeholder="Enter price"
              step="0.01"
            />
            {errors.price && <span className="text-red-600 text-sm mt-1">{errors.price.message}</span>}
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium mb-2 uppercase">
              Product Image
            </label>
            <input
              id="image"
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              className="w-full p-3 border border-gray-200 rounded-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-colors file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
            />
            {!image && <span className="text-gray-500 text-sm mt-1">Please select an image</span>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white py-3 px-4 rounded-none hover:bg-gray-800 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed uppercase"
          >
            {isSubmitting ? "Creating Product..." : "Create Product"}
          </button>
        </form>
      </div>
    </div>
  )
}

