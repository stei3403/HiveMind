import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t dark:border-gray-700 py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm text-gray-700 dark:text-gray-300">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">HiveMind</h3>
          <p>An open-source idea commons where unused ideas get a second life.</p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Explore</h4>
          <ul className="space-y-1">
            <li><Link to="/browse" className="hover:underline">Browse Ideas</Link></li>
            <li><Link to="/submit" className="hover:underline">Submit an Idea</Link></li>
            <li><Link to="/success-stories" className="hover:underline">Success Stories</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Community</h4>
          <ul className="space-y-1">
            <li><Link to="/guidelines" className="hover:underline">Guidelines</Link></li>
            <li><Link to="/get-started" className="hover:underline">Get Started</Link></li>
            <li><Link to="/join" className="hover:underline">Join Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Resources</h4>
          <ul className="space-y-1">
            <li><Link to="/blog" className="hover:underline">Blog</Link></li>
            <li><Link to="/faq" className="hover:underline">FAQ</Link></li>
            <li><Link to="/contact" className="hover:underline">Contact</Link></li>
          </ul>
        </div>
      </div>

      <div className="mt-10 text-center text-xs text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} HiveMind. Built with ❤️ by the community.
      </div>
    </footer>
  );
};

export default Footer;
