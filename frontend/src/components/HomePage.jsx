
import HeroSection from './HeroSection';
import ProductGrid from './ProductGrid';

const products = [
  {
    id: 1,
    name: "Slim Fit Cotton Mesh Polo Shirt",
    price: 150.99,
    image: "https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-1504821_lifestyle?$rl_4x5_zoom$",
    description: "Elevate your casual style with this versatile polo shirt."
  },
  {
    id: 2,
    name: "Custom Slim Fit Mesh Polo Shirt",
    price: 199.99,
    image: "https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-1164604_lifestyle?$rl_4x5_zoom$",
    description: "Crafted with premium materials for a refined look."
  },
  {
    id: 3,
    name: "Custom Slim Fit Stretch Mesh Polo Shirt",
    price: 59.99,
    image: "https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-AI710941439003_lifestyle?$rl_4x5_zoom$",
    description: "Designed for all-day comfort and style."
  },
  {
    id: 4,
    name: "Custom Slim Fit Stretch Mesh Polo Shirt",
    price: 999.99,
    image: "https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-AI710968951003_lifestyle?$rl_4x5_zoom$",
    description: "Elevate your wardrobe with this premium polo shirt."
  },
  {
    id: 5,
    name: "Custom Slim Fit Soft Cotton Polo Shirt",
    price: 699.99,
    image: "https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-1429832_lifestyle?$rl_4x5_zoom$",
    description: "Experience the ultimate in comfort and style."
  },
  {
    id: 6,
    name: "Custom Slim Fit Mesh Polo Shirt",
    price: 349.99,
    image: "https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-1348098_lifestyle?$rl_4x5_zoom$",
    description: "Elevate your wardrobe with this premium polo shirt."
  }
];

const Homepage = () => {
  return (
    <div>
      <HeroSection />
      <ProductGrid products={products} />
    </div>
  );
};

export default Homepage;