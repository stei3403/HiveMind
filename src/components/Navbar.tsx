import React, { useEffect, useState } from 'react';

const Navbar = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'system');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <nav className='flex items-center justify-between px-4 py-2 border-b dark:border-gray-700'>
      <h1 className='text-lg font-bold'>HiveMind</h1>
      <div>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className='bg-gray-200 dark:bg-gray-800 text-sm p-1 rounded'
        >
          <option value='system'>System</option>
          <option value='light'>Light</option>
          <option value='dark'>Dark</option>
        </select>
      </div>
    </nav>
  );
};

export default Navbar;