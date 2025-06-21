import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import IdeaCard from '../components/IdeaCard';
import FinalCallToAction from '../components/FinalCallToAction';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

// Type definition for idea
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

const LandingPage: React.FC = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const fullSubtitle = "Transform your unused ideas into collaborative projects. Share, discover, and build amazing things together.";
  const [subtitle, setSubtitle] = useState('');
  const [subtitleCursorVisible, setSubtitleCursorVisible] = useState(true);

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'ideas'));
        const ideasData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            problem: data.problem,
            solution: data.solution,
            category: data.category || 'General',
            status: data.status || 'Just an Idea',
            upvotes: data.upvotes || 0,
            authorName: data.authorName || 'Anonymous',
            featureImage: data.featureImage || '',
          };
        }) as Idea[];
        setIdeas(ideasData);
      } catch (error) {
        console.error("Error fetching ideas: ", error);
      }
    };
    fetchIdeas();
  }, []);

  useEffect(() => {
    let i = 0;
    if (subtitle.length < fullSubtitle.length) {
      setSubtitleCursorVisible(true);
      const typingInterval = setInterval(() => {
        if (i < fullSubtitle.length) {
          setSubtitle(prev => prev + fullSubtitle.charAt(i));
          i++;
        } else {
          clearInterval(typingInterval);
          setSubtitleCursorVisible(false);
        }
      }, 35);
      return () => clearInterval(typingInterval);
    } else {
      setSubtitleCursorVisible(false);
    }
  }, [fullSubtitle]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <main className="flex-grow">
        <section className="relative overflow-hidden bg-gradient-to-b from-yellow-100 via-yellow-50 to-gray-50 dark:from-yellow-800/30 dark:via-gray-800/30 dark:to-gray-900 py-20 md:py-32">
          <div className="relative z-10 container mx-auto px-4 text-center">
            <div className="inline-block bg-white dark:bg-gray-700 shadow-md rounded-full px-4 py-2 mb-6">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">✨ Open-Source Idea Commons</p>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-800 dark:text-gray-100 mb-6 font-playfair-display">
              Where Ideas Find Their Wings
            </h1>
            <p className={`text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10 h-24 md:h-16 overflow-hidden whitespace-pre-wrap break-words ${subtitleCursorVisible ? 'animate-typing-cursor border-r-2 border-transparent' : ''}`}
              style={{ borderColor: subtitleCursorVisible ? 'currentColor' : 'transparent' }}>
              {subtitle}
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/browse" className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold py-4 px-8 rounded-full text-lg transition-all duration-200 ease-in-out transform hover:-translate-y-px hover:shadow-xl w-full sm:w-auto">
                🔍 Browse Ideas
              </Link>
              <Link to="/submit" className="bg-white dark:bg-gray-700 dark:hover:bg-gray-600 hover:bg-gray-100 text-gray-800 dark:text-gray-200 font-semibold py-4 px-8 rounded-full text-lg border-2 border-yellow-400 dark:border-yellow-500 transition-all duration-200 ease-in-out transform hover:-translate-y-px hover:shadow-xl w-full sm:w-auto">
                💡 Submit Your Idea
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div><p className="text-4xl font-extrabold text-yellow-500 dark:text-yellow-400">347</p><p className="text-gray-600 dark:text-gray-300">Ideas Shared</p></div>
              <div><p className="text-4xl font-extrabold text-yellow-500 dark:text-yellow-400">1.2K</p><p className="text-gray-600 dark:text-gray-300">Active Builders</p></div>
              <div><p className="text-4xl font-extrabold text-yellow-500 dark:text-yellow-400">89</p><p className="text-gray-600 dark:text-gray-300">Projects Launched</p></div>
              <div><p className="text-4xl font-extrabold text-yellow-500 dark:text-yellow-400">4.5K</p><p className="text-gray-600 dark:text-gray-300">Collaborations</p></div>
            </div>
          </div>
        </section>

        {/* Fresh from the Hive */}
        <section className="py-20 bg-yellow-50 dark:bg-gray-800/30">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 text-center mb-4 font-playfair-display">
              Fresh from the Hive
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 text-center max-w-xl mx-auto mb-12">
              Discover ideas waiting to be built. Find your next project.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              {[...ideas]
                .sort((a, b) => b.upvotes - a.upvotes)
                .slice(0, 3)
                .map((idea) => (
                <Link to={`/idea/${idea.id}`} key={idea.id}>
                  <IdeaCard
                    key={idea.id}
                    title={idea.title}
                    problem={idea.problem}
                    solution={idea.solution}
                    category={idea.category}
                    status={idea.status}
                    upvotes={idea.upvotes}
                    author={idea.authorName}
                    featureImage={idea.featureImage}
                  />
                </Link>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link to="/browse" className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold py-3 px-6 rounded-full transition-all duration-200 ease-in-out transform hover:-translate-y-px hover:shadow-xl">
                Browse All Ideas →
              </Link>
            </div>
          </div>
        </section>


        {/* How HiveMind Works Section */}
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 text-center mb-4 font-playfair-display">
              How HiveMind Works
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 text-center max-w-xl mx-auto mb-12">
              Join a community where ideas evolve through collaboration
            </p>
            <div className="grid md:grid-cols-3 gap-x-8 gap-y-12">
              <div className="text-center">
                <div className="relative mb-6 inline-block">
                  <img src="/share.png" alt="Share your idea" className="w-40 h-40 object-cover rounded-lg bg-yellow-100 dark:bg-yellow-800/50 mx-auto"/>
                  <div className="absolute -top-3 -right-3 bg-yellow-400 text-gray-800 w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold">1</div>
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Share Your Idea</h3>
                <p className="text-gray-600 dark:text-gray-300">Submit your unused ideas, half-baked concepts, or ambitious projects that need a team.</p>
              </div>
              <div className="text-center">
                 <div className="relative mb-6 inline-block">
                  <img src="/discover.png" alt="Find collaborators" className="w-40 h-40 object-cover rounded-lg bg-yellow-100 dark:bg-yellow-800/50 mx-auto"/>
                  <div className="absolute -top-3 -right-3 bg-yellow-400 text-gray-800 w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold">2</div>
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Find Collaborators</h3>
                <p className="text-gray-600 dark:text-gray-300">Connect with developers, designers, and experts who are excited about your vision.</p>
              </div>
              <div className="text-center">
                 <div className="relative mb-6 inline-block">
                  <img src="/build.png" alt="Build together" className="w-40 h-40 object-cover rounded-lg bg-yellow-100 dark:bg-yellow-800/50 mx-auto"/>
                  <div className="absolute -top-3 -right-3 bg-yellow-400 text-gray-800 w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold">3</div>
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Build Together</h3>
                <p className="text-gray-600 dark:text-gray-300">Transform ideas into reality with community support, feedback, and shared resources.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Most Ideas Don't Die Section */}
        <section className="py-20 bg-yellow-50 dark:bg-gray-800/30">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-6 font-playfair-display leading-tight">
                  Most Ideas Don't Die <br />Because They're Bad.
                </h2>
                <p className="text-xl text-gray-700 dark:text-gray-200 mb-6">
                  They die because time, capital, or bandwidth were in short supply.
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  HiveMind is a public think tank built for people like you: dreamers, tinkerers, and creators with notebooks full of apps, inventions, and business ideas that never made it off the ground.
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  We're flipping the script. This is a digital idea commons — a space where thoughtful, unfinished, or even half-baked ideas can be shared openly for others to explore, build, and improve.
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                  Because the best ideas deserve more than a dusty notebook. They deserve a chance to live.
                </p>
                <Link
                  to="/browse"
                  className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold py-3 px-6 rounded-full transition-all duration-200 ease-in-out transform hover:-translate-y-px hover:shadow-xl"
                >
                  Explore Ideas in the Hive
                </Link>
              </div>
              <div className="md:w-1/2">
                <img src="/trash.png" alt="Idea in a trash can" className="w-full max-w-md mx-auto rounded-lg shadow-xl"/>
              </div>
            </div>
          </div>
        </section>

        <FinalCallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;