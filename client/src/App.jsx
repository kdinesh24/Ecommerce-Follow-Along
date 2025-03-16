import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import Homepage from "./components/HomePage";
import HeroSection from "./components/HeroSection";
import SellerPage from "./components/SellerPage";
import ShoesPage from "./components/ShoesPage";
import ProfilePage from "./components/ProfilePage";
import SignupPage from "./components/SignupPage";
import LifestylePage from "./components/LifestylePage";
import PerfumesPage from "./components/PerfumesPage";
import ProductInfo from "./components/ProductInfo";
import Cart from "./components/Cart";
import { Toaster } from 'react-hot-toast';
import Order from "./components/Order";
import Payment from "./components/Payment";
import { SearchProvider } from './components/SearchContext';
import SearchResults from "./components/SearchResults";


function HomeLayout() {
  return (
    <div className="bg-gray-950">
      <HeroSection />
      <Homepage />
    </div>
  );
}

function App() {
  return (
    <SearchProvider>
    <div className="flex-grow">
      <Routes>
        <Route path="/" element={<Navigate to="/ecommerce-follow-along/login" replace />} />
        <Route path="/ecommerce-follow-along/login" element={<LoginPage />} />
        <Route path="/ecommerce-follow-along/signup" element={<SignupPage />} />
        <Route path="/ecommerce-follow-along/home" element={<HomeLayout />} />
        <Route path="/ecommerce-follow-along/seller" element={<SellerPage />} />
        <Route path="/ecommerce-follow-along/shoes" element={<ShoesPage />} />
        <Route path="/ecommerce-follow-along/profile" element={<ProfilePage />} />
        <Route path="/ecommerce-follow-along/lifestyle" element={<LifestylePage />} />
        <Route path="/ecommerce-follow-along/perfume" element={<PerfumesPage />} />
        <Route path="/ecommerce-follow-along/product/:id" element={<ProductInfo />} />
        <Route path="/ecommerce-follow-along/cart" element={<Cart />} />
        <Route path="/ecommerce-follow-along/order" element={<Order />} />
        <Route path="/ecommerce-follow-along/payment" element={<Payment />} />
        <Route path="/ecommerce-follow-along/search-results" element={<SearchResults />} />
        
      </Routes>
      <Toaster />
    </div>
    </SearchProvider>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
