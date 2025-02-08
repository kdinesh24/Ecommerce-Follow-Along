import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import { ChevronDown } from "lucide-react";
import Footer from "./Footer";

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
                const response = await axios.get("http://localhost:3000/items/products");
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
        <div className="bg-white px-4 sm:px-6 lg:px-20 pb-5 mt-[-3rem]">
            <div className="container mx-auto max-w-7xl">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold ml-[-1rem]">Featured Products</h1>
                    
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

                                    <h3 className="text-xs font-semibold text-gray-500 uppercase px-3 pb-2 pt-2">Category</h3>
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

                                    <h3 className="text-xs font-semibold text-gray-500 uppercase px-3 pb-2 pt-2">For</h3>
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
            <div className="mt-3">
                <Footer />
            </div>
        </div>
    );
}