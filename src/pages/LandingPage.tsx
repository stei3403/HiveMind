import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import IdeaCard from '../components/IdeaCard';
import HeroSection from '../components/HeroSection';
import HowItWorks from '../components/HowItWorks';
import MissionStatement from '../components/MissionStatement';
import FinalCallToAction from '../components/FinalCallToAction';

type Idea = {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  upvotes: number;
  authorName: string;
};

const LandingPage = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);

  useEffect(() => {
    const fetchIdeas = async () => {
      const querySnapshot = await getDocs(collection(db, 'ideas'));
      const ideasData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Idea[];
      setIdeas(ideasData);
    };

    fetchIdeas();
  }, []);

  return (
    <>
      <HeroSection />
    
      <section className="bg-white dark:bg-gray-900 py-16 px-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Fresh from the Hive</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ideas.map(idea => (
            <IdeaCard
              key={idea.id}
              title={idea.title}
              description={idea.description}
              category={idea.category}
              status={idea.status}
              upvotes={idea.upvotes}
              author={idea.authorName}
            />
          ))}
        </div>
      </section>

      <HowItWorks />
      <MissionStatement />
      <FinalCallToAction />
    </>
  );
};

export default LandingPage;
