"use client"

import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import { ChevronDown } from "lucide-react";
import Footer from "./Footer";
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";

const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
}

export default function ShoesPage() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [sortMenuOpen, setSortMenuOpen] = useState(false);
    const [activeSortOption, setActiveSortOption] = useState("featured");
    const [activeNavItem, setActiveNavItem] = useState('');

    const categories = ["all", "men", "women", "unisex"];
    const subcategories = ["all", "running", "casual", "formal"];

    useEffect(() => {
        const fetchProducts = async () => {    
            try {
                const response = await axios.get("http://localhost:3000/items/products");
                const shoeProducts = response.data.filter(product => product.category === "shoe");
                setProducts(shoeProducts);
                setFilteredProducts(shoeProducts);
            } catch (error) {
                setError("Error fetching products");
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleSort = (option) => {
        setActiveSortOption(option);
        let sorted = [...filteredProducts];

        switch (option) {
            case "price-low":
                sorted.sort((a, b) => a.price - b.price);
                break;
            case "price-high":
                sorted.sort((a, b) => b.price - a.price);
                break;
            case "featured":
                sorted = [...products];
                break;
            default:
                if (categories.includes(option)) {
                    sorted = option === "all" 
                        ? [...products]
                        : products.filter(product => product.subcategory === option);
                } else if (subcategories.includes(option)) {
                    sorted = option === "all"
                        ? [...products]
                        : products.filter(product => product.subcategory === option);
                }
        }

        setFilteredProducts(sorted);
        setSortMenuOpen(false);
    };

    const navItems = ["Home", "Lifestyle", "Shoes", "Perfume"]

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-gray-950 text-gray-200">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
    );

    if (error) return (
        <div className="flex items-center justify-center min-h-screen bg-gray-950 text-red-400">
            {error}
        </div>
    );

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

            <div className="bg-white px-4 sm:px-6 lg:px-10 pb-8 pt-32 min-h-[calc(100vh-14rem)]">
                <div className="container mx-auto max-w-7xl">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold">Shoes Collection</h1>
                        
                        <div className="relative">
                            <button
                                onClick={() => setSortMenuOpen(!sortMenuOpen)}
                                className="bg-transparent border-2 border-black text-black px-6 py-2 rounded-full hover:bg-black hover:text-white transition-colors duration-300 flex items-center space-x-2"
                            >
                                <span>Sort by</span>
                                <ChevronDown size={16} />
                            </button>

                            {sortMenuOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                    <div className="p-2 space-y-1">
                                        <h3 className="text-xs font-semibold text-gray-500 uppercase px-3 pb-2">Price</h3>
                                        {[
                                            { id: "price-low", label: "Price: Low to High" },
                                            { id: "price-high", label: "Price: High to Low" },
                                        ].map((option) => (
                                            <button
                                                key={option.id}
                                                onClick={() => handleSort(option.id)}
                                                className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                                                    activeSortOption === option.id
                                                        ? "bg-black text-white"
                                                        : "text-black hover:bg-black hover:text-white"
                                                }`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}

                                        <h3 className="text-xs font-semibold text-gray-500 uppercase px-3 pb-2 pt-2">Gender</h3>
                                        {categories.map((category) => (
                                            <button
                                                key={category}
                                                onClick={() => handleSort(category)}
                                                className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors capitalize ${
                                                    activeSortOption === category
                                                        ? "bg-black text-white"
                                                        : "text-black hover:bg-black hover:text-white"
                                                }`}
                                            >
                                                {category}
                                            </button>
                                        ))}

                                        <h3 className="text-xs font-semibold text-gray-500 uppercase px-3 pb-2 pt-2">Type</h3>
                                        {subcategories.map((subcategory) => (
                                            <button
                                                key={subcategory}
                                                onClick={() => handleSort(subcategory)}
                                                className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors capitalize ${
                                                    activeSortOption === subcategory
                                                        ? "bg-black text-white"
                                                        : "text-black hover:bg-black hover:text-white"
                                                }`}
                                            >
                                                {subcategory}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-7 gap-y-10">
                        {filteredProducts.map((product) => (
                            <ProductCard
                                key={product._id}
                                _id={product._id}
                                name={product.name}
                                description={product.description}
                                price={parseFloat(product.price)}
                                image={product.imageUrl}
                                category={product.category}
                                subcategory={product.subcategory}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <div className="mb-4">
                <Footer />
            </div>
        </motion.div>
    );
}