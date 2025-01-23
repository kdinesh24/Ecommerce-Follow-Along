
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Homepage from './components/HomePage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/ecommerce-follow-along" replace />} />
        <Route path="/ecommerce-follow-along" element={<Login />} />
        <Route
          path="/ecommerce-follow-along/home"
          element={
            <>
              
              <Navbar />
              <Homepage />
              <Footer />
            </>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;