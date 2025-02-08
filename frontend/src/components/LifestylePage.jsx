import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import { ChevronDown } from "lucide-react";
import Footer from "./Footer";
import { useNavigate } from 'react-router-dom';

export default function LifestylePage() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [sortMenuOpen, setSortMenuOpen] = useState(false);
    const [activeSortOption, setActiveSortOption] = useState("featured");

    // Updated categories and subcategories for clothing
    const categories = ["all", "men", "women", "unisex"];
    const subcategories = ["all", "shirts", "pants", "dresses", "jackets"];

    useEffect(() => {
        const fetchProducts = async () => {    
            try {
                const response = await axios.get("http://localhost:3000/items/products");
                // Changed filter to get clothing items
                const clothingProducts = response.data.filter(product => product.category === "clothing");
                setProducts(clothingProducts);
                setFilteredProducts(clothingProducts);
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
        <>
            <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
                <div className="bg-white/90 backdrop-blur-md rounded-full shadow-xl p-6 border border-gray-100">
                    <div className="flex items-center space-x-12">
                        <button 
                            onClick={() => navigate('/ecommerce-follow-along/home')}
                            className="text-gray-700 hover:text-black transition-all duration-200 flex flex-col items-center group"
                        >
                            <span className="text-base font-semibold group-hover:scale-110 transform transition-transform">Home</span>
                            <div className="h-1 w-0 group-hover:w-full bg-black mt-1 transition-all duration-200"></div>
                        </button>
                        
                        <button 
                            onClick={() => navigate('/ecommerce-follow-along/lifestyle')}
                            className="text-gray-700 hover:text-black transition-all duration-200 flex flex-col items-center group"
                        >
                            <span className="text-base font-semibold group-hover:scale-110 transform transition-transform">Lifestyle</span>
                            <div className="h-1 w-0 group-hover:w-full bg-black mt-1 transition-all duration-200"></div>
                        </button>
                        
                        <button 
                            onClick={() => navigate('/ecommerce-follow-along/shoes')}
                            className="text-gray-700 hover:text-black transition-all duration-200 flex flex-col items-center group"
                        >
                            <span className="text-base font-semibold group-hover:scale-110 transform transition-transform">Shoes</span>
                            <div className="h-1 w-0 group-hover:w-full bg-black mt-1 transition-all duration-200"></div>
                        </button>
                        
                        <button 
                            onClick={() => navigate('/ecommerce-follow-along/perfume')}
                            className="text-gray-700 hover:text-black transition-all duration-200 flex flex-col items-center group"
                        >
                            <span className="text-base font-semibold group-hover:scale-110 transform transition-transform">Perfume</span>
                            <div className="h-1 w-0 group-hover:w-full bg-black mt-1 transition-all duration-200"></div>
                        </button>
                    </div>
                </div>
            </nav>

            <div className="bg-white px-4 sm:px-6 lg:px-10 pb-8 pt-32 min-h-[calc(100vh-14rem)]">
                <div className="container mx-auto max-w-7xl">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold">Lifestyle Collection</h1>
                        
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
            <div className="mt-24">
                <Footer />
            </div>
        </>
    );
}
