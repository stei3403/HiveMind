import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🍯</span>
              <span className="text-xl font-bold text-gray-800 dark:text-white">HiveMind</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm max-w-md">
              An open-source idea commons where unused ideas get a second life. Built by creators, for creators.
            </p>
          </div>
          <div>
            <h5 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">Explore</h5>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 text-sm transition-colors">Browse Ideas</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 text-sm transition-colors">Submit an Idea</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 text-sm transition-colors">Success Stories</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 text-sm transition-colors">Community Guidelines</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">Resources</h5>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 text-sm transition-colors">How it Works</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 text-sm transition-colors">FAQ</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 text-sm transition-colors">Blog</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 text-sm transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">© 2024 HiveMind. Built with 💛 by the community.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
