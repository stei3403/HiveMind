import React from 'react';
import { Link } from 'react-router-dom';

const ThankYouPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 text-center px-4">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">🎉 Thank you!</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">Your idea has been submitted and is now part of the HiveMind.</p>
      <Link
        to="/browse"
        className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-2 rounded-full font-semibold shadow"
      >
        Browse Ideas
      </Link>
    </div>
  );
};

export default ThankYouPage;
