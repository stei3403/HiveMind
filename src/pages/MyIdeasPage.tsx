import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import IdeaCard from '../components/IdeaCard';

type Idea = {
  id: string;
  title: string;
  problem: string;
  solution: string;
  category: string;
  status: string;
  upvotes: number;
  authorName: string;
  authorId: string;
  featureImage?: string;
};

const MyIdeasPage = () => {
  const { user } = useAuth();
  const [ideas, setIdeas] = useState<Idea[]>([]);

  useEffect(() => {
    const fetchIdeas = async () => {
      if (!user) return;

      const ideasQuery = query(
        collection(db, 'ideas'),
        where('authorId', '==', user.uid)
      );

      const querySnapshot = await getDocs(ideasQuery);
      const ideasData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Idea[];

      setIdeas(ideasData);
    };

    fetchIdeas();
  }, [user]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 text-center">My Ideas</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ideas.map(idea => (
          <IdeaCard
            key={idea.id}
            id={idea.id}
            title={idea.title}
            problem={idea.problem}
            solution={idea.solution}
            category={idea.category}
            status={idea.status}
            upvotes={idea.upvotes}
            authorId={idea.authorId}
            featureImage={idea.featureImage}
          />
        ))}
      </div>
    </div>
  );
};

export default MyIdeasPage;
