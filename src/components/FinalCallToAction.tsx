import React from 'react';

const FinalCallToAction = () => (
  <section className="bg-gradient-to-b from-[#FFFAE9] to-white py-20 px-6 dark:bg-gray-900">
    <div className="max-w-3xl mx-auto text-center">
      <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
        Ready to Give Your Ideas Wings?
      </h2>
      <p className="text-md sm:text-lg text-gray-700 dark:text-gray-300 mb-8">
        Join thousands of creators making ideas happen.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button className="bg-blue-600 text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-blue-700 transition">
          Submit Your First Idea
        </button>
        <button className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-md text-sm font-medium hover:bg-blue-50 dark:bg-transparent dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-blue-600 transition">
          Join Our Community
        </button>
      </div>
    </div>
  </section>
);

export default FinalCallToAction;
