import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import IdeaCard from '../components/IdeaCard';
import { useNavigate } from 'react-router-dom';

type Idea = {
  id: string;
  title: string;
  problem: string;
  solution: string;
  category: string;
  status: string;
  upvotes: number;
  authorName: string;
  featureImage?: string;
};

const BrowsePage = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIdeas = async () => {
      const querySnapshot = await getDocs(collection(db, 'ideas'));
      const ideasData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Idea[];
      setIdeas(ideasData);
    };

    fetchIdeas();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 text-center">Browse Ideas</h1>

      {/* Placeholder for future filter UI */}
      <div className="mb-8 flex flex-wrap gap-3 justify-center text-sm text-gray-600 dark:text-gray-300">
        <span className="border px-3 py-1 rounded-full cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
          All Categories
        </span>
        <span className="border px-3 py-1 rounded-full cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
          Civic Tech
        </span>
        <span className="border px-3 py-1 rounded-full cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
          Sustainability
        </span>
      </div>

      {/* Idea Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ideas.map(idea => (
          <div
            key={idea.id}
            onClick={() => navigate(`/idea/${idea.id}`)}
            className="cursor-pointer hover:scale-[1.01] transition-transform"
          >
            <IdeaCard
              title={idea.title}
              problem={idea.problem}
              solution={idea.solution}
              category={idea.category}
              status={idea.status}
              upvotes={idea.upvotes}
              author={idea.authorName}
              featureImage={idea.featureImage}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrowsePage;
