import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User } from 'firebase/auth';

const Navbar: React.FC = () => {
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) return storedTheme;
    // If no theme is stored, check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light'; // Default to light if no preference or storage
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/98 dark:bg-gray-900/95 shadow-sm backdrop-blur-md">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3">
          <span className="text-3xl">🍯</span>
          <span className="text-2xl font-bold text-gray-800 dark:text-white">HiveMind</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
          <Link to="/browse" className="text-gray-600 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors">Browse Ideas</Link>
          <Link to="/#how-it-works" className="text-gray-600 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors">How it Works</Link> {/* Assuming an ID on LandingPage */}
          <Link to="/submit" className="text-gray-600 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors">Submit Idea</Link>
          <Link to="/#community" className="text-gray-600 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors">Community</Link> {/* Assuming an ID on LandingPage */}
        </div>

        <div className="flex items-center space-x-3">
          <Link 
            to="/login"
            className="hidden md:block bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold py-3 px-6 rounded-full transition-colors"
          >
            Get Started
          </Link>

          
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="text-gray-600 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 p-2 rounded-full transition-colors focus:outline-none"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? 
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg> :
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            }
          </button>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMobileMenu}
              className="text-gray-800 dark:text-gray-200 focus:outline-none p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? 
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg> :
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
              }
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 py-3 px-4 border-t border-gray-200 dark:border-gray-700">
          <Link to="/browse" className="block py-2 px-3 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800" onClick={toggleMobileMenu}>Browse Ideas</Link>
          <Link to="/#how-it-works" className="block py-2 px-3 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800" onClick={toggleMobileMenu}>How it Works</Link>
          <Link to="/submit" className="block py-2 px-3 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800" onClick={toggleMobileMenu}>Submit Idea</Link>
          <Link to="/#community" className="block py-2 px-3 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800" onClick={toggleMobileMenu}>Community</Link>
          <Link to="/login" className="block w-full mt-3 bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold py-3 px-4 rounded-md text-center transition-colors" onClick={toggleMobileMenu}>Get Started</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
