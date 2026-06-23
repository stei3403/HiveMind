import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) return storedTheme;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const closeMenus = () => {
    setIsMobileMenuOpen(false);
    setDropdownOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 shadow-sm backdrop-blur-md">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3" onClick={closeMenus}>
          <img src="/hive.png" alt="" className="h-9 w-9 rounded-md object-cover" />
          <span className="text-2xl font-bold text-gray-800 dark:text-white">HiveMind</span>
        </Link>

        <div className="hidden md:flex items-center gap-7">
          <Link to="/browse" className="text-gray-600 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors">Browse</Link>
          <Link to="/submit" className="text-gray-600 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors">Submit</Link>
          <Link to="/how-it-works" className="text-gray-600 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors">How it Works</Link>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setTheme(prev => (prev === 'light' ? 'dark' : 'light'))}
            className="text-gray-600 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 p-2 rounded-full transition-colors focus:outline-none"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(prev => !prev)}
                className="focus:outline-none"
                aria-label="Open user menu"
              >
                <img
                  src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || user.email || 'User'}`}
                  alt=""
                  className="w-9 h-9 rounded-full border border-gray-300 shadow-sm"
                />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 py-2 text-sm">
                  <Link
                    to="/my-ideas"
                    onClick={closeMenus}
                    className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {isAdmin ? 'Manage Ideas' : 'My Ideas'}
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      closeMenus();
                      logout();
                    }}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="hidden sm:inline-flex bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-md font-semibold shadow">
              Log In
            </Link>
          )}

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(prev => !prev)}
            className="md:hidden text-gray-800 dark:text-gray-200 focus:outline-none p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 py-3 px-4 border-t border-gray-200 dark:border-gray-700">
          <Link to="/browse" className="block py-2 px-3 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800" onClick={closeMenus}>Browse</Link>
          <Link to="/submit" className="block py-2 px-3 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800" onClick={closeMenus}>Submit</Link>
          <Link to="/how-it-works" className="block py-2 px-3 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800" onClick={closeMenus}>How it Works</Link>
          {user ? (
            <Link to="/my-ideas" className="block py-2 px-3 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800" onClick={closeMenus}>
              {isAdmin ? 'Manage Ideas' : 'My Ideas'}
            </Link>
          ) : (
            <Link to="/login" className="block w-full mt-3 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-3 px-4 rounded-md text-center transition-colors" onClick={closeMenus}>
              Log In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
