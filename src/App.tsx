import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
// import LandingPage from './pages/LandingPage'; // Original LandingPage import
import LandingPage from './pages/LandingPage'; // New LandingPage based on Figma
import SubmitPage from './pages/SubmitPage';
import BrowsePage from './pages/BrowsePage';
import LoginPage from './pages/LoginPage';
import ThankYouPage from './pages/ThankYouPage';
import ProtectedRoute from './routes/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/submit" element={<ProtectedRoute><SubmitPage /></ProtectedRoute >} />
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/thanks" element={<ThankYouPage />} />
      </Routes>
      <Toaster position="top-right" />
      {/* Footer is part of LandingPage, but might be needed globally for other pages */}
      {/* <Footer /> */}
    </>
  );
}

export default App;
