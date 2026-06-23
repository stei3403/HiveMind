import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/hive.png" alt="" className="h-8 w-8 rounded-md object-cover" />
              <span className="text-xl font-bold text-gray-800 dark:text-white">HiveMind</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm max-w-md">
              An idea commons where unused concepts get clearer, easier to find, and easier to build.
            </p>
          </div>

          <nav className="flex flex-col sm:flex-row gap-3 sm:gap-6 text-sm">
            <Link to="/browse" className="text-gray-600 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors">
              Browse
            </Link>
            <Link to="/submit" className="text-gray-600 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors">
              Submit
            </Link>
            <Link to="/how-it-works" className="text-gray-600 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors">
              How it Works
            </Link>
          </nav>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 mt-10 pt-6">
          <p className="text-gray-500 dark:text-gray-400 text-sm">(c) 2026 HiveMind.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
