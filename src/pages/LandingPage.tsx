import React from 'react';
import IdeaCard from '../components/IdeaCard';

const LandingPage = () => {
  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Trending Ideas</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {[1, 2, 3].map((i) => <IdeaCard key={i} />)}
      </div>
    </div>
  );
};

export default LandingPage;