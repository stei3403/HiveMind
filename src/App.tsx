import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
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
      <Footer />
    </>
  );
}

export default App;
