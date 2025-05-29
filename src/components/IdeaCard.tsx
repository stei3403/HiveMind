import React from 'react';

const IdeaCard = () => {
  return (
    <div className='border dark:border-gray-700 rounded-lg p-4 shadow hover:shadow-lg transition'>
      <h2 className='text-xl font-semibold mb-2'>Idea Title</h2>
      <p className='text-sm mb-2'>This is a short description of the idea...</p>
      <span className='text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded'>Civic Tech</span>
    </div>
  );
};

export default IdeaCard;