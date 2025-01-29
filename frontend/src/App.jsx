
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProfilePage from './components/ProfilePage';
import AboutPage from './components/AboutPage';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/ecommerce-follow-along" />} />
        <Route path="/ecommerce-follow-along" element={<LoginPage />} />
        <Route path="/ecommerce-follow-along/home" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;