import React from 'react';
import LandingPage from './pages/LandingPage';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className='bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen'>
      <Navbar />
      <LandingPage />
    </div>
  );
}

export default App;