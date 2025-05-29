import React from 'react';
import { Link } from 'react-router-dom';

const FinalCallToAction = () => (
  <section className="py-24 bg-gradient-to-b from-yellow-400 to-orange-400 dark:from-slate-800 dark:to-slate-900">
    <div className="container mx-auto px-4 text-center">
      <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-6 font-playfair-display animate-fadeInUp">
        Ready to Bring Your Ideas to Life?
      </h2>
      <p className="text-lg md:text-xl text-gray-700 dark:text-gray-100 max-w-xl mx-auto mb-10 animate-fadeInUp animate-delay-200">
        Join HiveMind today and start collaborating on exciting new projects. Your next big idea could be just a click away.
      </p>
      <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 animate-fadeInUp animate-delay-400">
        <Link
          to="/submit"
          className="bg-gray-800 dark:bg-white hover:bg-gray-700 dark:hover:bg-gray-200 text-white dark:text-gray-800 font-semibold py-4 px-8 rounded-full text-lg transition-all duration-200 ease-in-out transform hover:-translate-y-px hover:shadow-xl w-full sm:w-auto"
        >
          🐝 Join the Hive
        </Link>
        <Link
          to="/submit"
          className="bg-transparent hover:bg-yellow-500/20 text-gray-800 dark:text-white dark:hover:bg-yellow-300/20 font-semibold py-4 px-8 rounded-full text-lg border-2 border-gray-800 dark:border-white transition-all duration-200 ease-in-out transform hover:-translate-y-px hover:shadow-xl w-full sm:w-auto"
        >
          💡 Submit an Idea
        </Link>
      </div>
    </div>
  </section>
);

export default FinalCallToAction;
