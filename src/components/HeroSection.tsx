import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-b from-[#FFFAE9] to-white py-20 px-6 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6 text-gray-900 dark:text-white">
          Open-Source Idea Commons
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8">
          Transform your unused ideas into collaborative projects. Share, discover, and build amazing things together.
        </p>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
          <Link
            to="/browse"
            className="bg-blue-600 text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-blue-700 transition text-center"
          >
            Browse Ideas
          </Link>
          <Link
            to="/submit"
            className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-md text-sm font-medium hover:bg-blue-50 dark:bg-transparent dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-blue-600 transition text-center"
          >
            Submit Your Idea
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm text-gray-700 dark:text-gray-300">
          <div>
            <div className="text-xl font-bold text-blue-600 dark:text-blue-400">347</div>
            <div>Ideas Shared</div>
          </div>
          <div>
            <div className="text-xl font-bold text-blue-600 dark:text-blue-400">1.2K</div>
            <div>Active Builders</div>
          </div>
          <div>
            <div className="text-xl font-bold text-blue-600 dark:text-blue-400">89</div>
            <div>Projects Launched</div>
          </div>
          <div>
            <div className="text-xl font-bold text-blue-600 dark:text-blue-400">4.5K</div>
            <div>Collaborations</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
