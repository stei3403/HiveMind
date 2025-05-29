import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'system');

  // Update theme when user toggles it
  useEffect(() => {
    const root = window.document.documentElement;
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <nav className="w-full bg-white dark:bg-gray-900 border-b dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          HiveMind
        </Link>

        {/* Nav Links */}
        <div className="flex gap-4 items-center">
          <Link to="/browse" className="text-gray-800 dark:text-gray-200 hover:underline">Browse Ideas</Link>
          <Link
            to="/submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
          >
            Submit Your Idea
          </Link>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="ml-2 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition text-sm"
          >
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
