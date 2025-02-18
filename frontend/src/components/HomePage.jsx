import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import { ChevronDown } from "lucide-react";
import Footer from "./Footer";
import { motion, AnimatePresence } from "framer-motion";

export default function Homepage() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [sortMenuOpen, setSortMenuOpen] = useState(false);
    const [activeSortOption, setActiveSortOption] = useState("featured");

    const categories = ["all", "clothing", "perfume", "shoe"];
    const subcategories = ["all", "men", "women", "unisex"];

    useEffect(() => {
        const fetchProducts = async () => {    
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/items/products`);
                console.log('Products from API:', response.data);
                setProducts(response.data);
                setFilteredProducts(response.data);
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
                        : products.filter(product => product.category === option);
                } else if (subcategories.includes(option)) {
                    sorted = option === "all"
                        ? [...products]
                        : products.filter(product => product.subcategory === option);
                }
        }

        setFilteredProducts(sorted);
        setSortMenuOpen(false);
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        }
    };

    const productVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    const dropdownVariants = {
        hidden: { opacity: 0, y: -10, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.2,
                ease: "easeOut"
            }
        },
        exit: {
            opacity: 0,
            y: -10,
            scale: 0.95,
            transition: {
                duration: 0.2,
                ease: "easeIn"
            }
        }
    };

    if (loading) return (
        <motion.div 
            className="flex items-center justify-center min-h-screen bg-gray-950 text-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div 
                className="h-12 w-12 border-b-2 border-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
        </motion.div>
    );

    if (error) return (
        <motion.div 
            className="flex items-center justify-center min-h-screen bg-gray-950 text-red-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {error}
        </motion.div>
    );

    return (
        <motion.div 
            className="bg-white px-4 sm:px-6 lg:px-20 pb-5 mt-[-3rem]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="container mx-auto max-w-7xl pb-20">
                <motion.div 
                    className="flex justify-between items-center mb-8"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-3xl font-bold ml-[-1rem]">Featured Products</h1>
                    
                    <div className="relative">
                        <motion.button
                            onClick={() => setSortMenuOpen(!sortMenuOpen)}
                            className="bg-transparent border-2 border-black text-black px-6 py-2 rounded-full hover:bg-black hover:text-white transition-colors duration-300 flex items-center space-x-2"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span>Sort by</span>
                            <motion.div
                                animate={{ rotate: sortMenuOpen ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <ChevronDown size={16} />
                            </motion.div>
                        </motion.button>

                        <AnimatePresence>
                            {sortMenuOpen && (
                                <motion.div 
                                    className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                                    variants={dropdownVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                >
                                    <div className="p-2 space-y-1">
                                        <h3 className="text-xs font-semibold text-gray-500 uppercase px-3 pb-2">Price</h3>
                                        {[
                                            { id: "price-low", label: "Price: Low to High" },
                                            { id: "price-high", label: "Price: High to Low" },
                                        ].map((option) => (
                                            <motion.button
                                                key={option.id}
                                                onClick={() => handleSort(option.id)}
                                                className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                                                    activeSortOption === option.id
                                                        ? "bg-black text-white"
                                                        : "text-black hover:bg-black hover:text-white"
                                                }`}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                {option.label}
                                            </motion.button>
                                        ))}

                                        <h3 className="text-xs font-semibold text-gray-500 uppercase px-3 pb-2 pt-2">Category</h3>
                                        {categories.map((category) => (
                                            <motion.button
                                                key={category}
                                                onClick={() => handleSort(category)}
                                                className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors capitalize ${
                                                    activeSortOption === category
                                                        ? "bg-black text-white"
                                                        : "text-black hover:bg-black hover:text-white"
                                                }`}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                {category}
                                            </motion.button>
                                        ))}

                                        <h3 className="text-xs font-semibold text-gray-500 uppercase px-3 pb-2 pt-2">For</h3>
                                        {subcategories.map((subcategory) => (
                                            <motion.button
                                                key={subcategory}
                                                onClick={() => handleSort(subcategory)}
                                                className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors capitalize ${
                                                    activeSortOption === subcategory
                                                        ? "bg-black text-white"
                                                        : "text-black hover:bg-black hover:text-white"
                                                }`}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                {subcategory}
                                            </motion.button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-7 gap-y-10"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {filteredProducts.map((product) => (
                        <motion.div
                            key={product._id}
                            variants={productVariants}
                            layout
                        >
                            <ProductCard
                                _id={product._id}
                                name={product.name}
                                description={product.description}
                                price={parseFloat(product.price)}
                                image={product.imageUrl}
                                category={product.category}
                                subcategory={product.subcategory}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
            <motion.div 
                className="mt-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <Footer />
            </motion.div>
        </motion.div>
    );
}