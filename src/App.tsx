import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
// import LandingPage from './pages/LandingPage'; // Original LandingPage import
import LandingPage from './pages/LandingPage'; // New LandingPage based on Figma
import SubmitPage from './components/SubmitPage';
import BrowsePage from './pages/BrowsePage';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/submit" element={<SubmitPage />} />
        <Route path="/browse" element={<BrowsePage />} />
      </Routes>
      {/* Footer is part of LandingPage, but might be needed globally for other pages */}
      {/* <Footer /> */}
    </>
  );
}

export default App;
