import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/LoginPage";
import Signup from "./components/SignupPage"; // Import SignupPage
import Homepage from "./components/HomePage";
import HeroSection from "./components/HeroSection";
import Footer from "./components/Footer";
import ProfilePage from "./components/ProfilePage";
import Navbar from "./components/Navbar";
import AboutPage from './components/AboutPage';

function HomeLayout() {
  return (
    <div className="bg-gray-950">
      <HeroSection />
      <Homepage />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Navigate to="/ecommerce-follow-along" replace />} />
            <Route path="/ecommerce-follow-along" element={<Login />} />
            <Route path="/ecommerce-follow-along/signup" element={<Signup />} /> {/* Add this route */}
            <Route path="/ecommerce-follow-along/home" element={<HomeLayout />} />
            <Route path="/ecommerce-follow-along/profile" element={<ProfilePage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}
