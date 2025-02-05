import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/LoginPage";
import Signup from "./components/SignupPage";
import Homepage from "./components/HomePage";
import HeroSection from "./components/HeroSection";
import Footer from "./components/Footer";
import SellerPage from "./components/SellerPage";

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
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Navigate to="/ecommerce-follow-along" replace />} />
          <Route path="/ecommerce-follow-along" element={<Login />} />
          <Route path="/ecommerce-follow-along/signup" element={<Signup />} />
          <Route path="/ecommerce-follow-along/home" element={<HomeLayout />} />
          <Route path="/ecommerce-follow-along/seller" element={<SellerPage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
