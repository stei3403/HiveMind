import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import IdeaCard from '../components/IdeaCard';
import FinalCallToAction from '../components/FinalCallToAction';
import Footer from '../components/Footer';
import { getIdeaScore } from '../services/votes';

type Idea = {
  id: string;
  title: string;
  problem: string;
  solution: string;
  category: string;
  status: string;
  upvotes: number;
  downvotes?: number;
  score?: number;
  adminScoreAdjustment?: number;
  authorName: string;
  featureImage?: string;
};

const fullSubtitle = 'Turn ideas into projects.';

const LandingPage: React.FC = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
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
            downvotes: data.downvotes || 0,
            score: data.score,
            adminScoreAdjustment: data.adminScoreAdjustment || 0,
            authorName: data.authorName || 'Anonymous',
            featureImage: data.featureImage || '',
          };
        }) as Idea[];
        setIdeas(ideasData);
      } catch (error) {
        console.error('Error fetching ideas: ', error);
      }
    };
    fetchIdeas();
  }, []);

  useEffect(() => {
    let i = 0;
    setSubtitle('');
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
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="flex-grow">
        <section className="relative overflow-hidden bg-gradient-to-b from-yellow-100 via-yellow-50 to-gray-50 dark:from-yellow-800/30 dark:via-gray-800/30 dark:to-gray-900 py-20 md:py-32">
          <div className="relative z-10 container mx-auto px-4 text-center">
            <div className="inline-block bg-white dark:bg-gray-700 shadow-md rounded-full px-4 py-2 mb-6">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">Open-Source Idea Commons</p>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-800 dark:text-gray-100 mb-6 font-playfair-display">
              Where Ideas Find Their Wings
            </h1>
            <p
              className={`inline-block text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-full mx-auto mb-10 min-h-8 whitespace-nowrap overflow-hidden ${subtitleCursorVisible ? 'animate-typing-cursor border-r-2 border-transparent pr-1' : ''}`}
              style={{ borderColor: subtitleCursorVisible ? 'currentColor' : 'transparent' }}
            >
              {subtitle}
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/browse" className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold py-4 px-8 rounded-full text-lg transition-all duration-200 ease-in-out transform hover:-translate-y-px hover:shadow-xl w-full sm:w-auto">
                Browse Ideas
              </Link>
              <Link to="/submit" className="bg-white dark:bg-gray-700 dark:hover:bg-gray-600 hover:bg-gray-100 text-gray-800 dark:text-gray-200 font-semibold py-4 px-8 rounded-full text-lg border-2 border-yellow-400 dark:border-yellow-500 transition-all duration-200 ease-in-out transform hover:-translate-y-px hover:shadow-xl w-full sm:w-auto">
                Submit Your Idea
              </Link>
            </div>
          </div>
        </section>

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
                .sort((a, b) => getIdeaScore(b) - getIdeaScore(a))
                .slice(0, 3)
                .map((idea) => (
                  <Link to={`/idea/${idea.id}`} key={idea.id}>
                    <IdeaCard
                      title={idea.title}
                      problem={idea.problem}
                      solution={idea.solution}
                      category={idea.category}
                      status={idea.status}
                      score={getIdeaScore(idea)}
                      upvotes={idea.upvotes}
                      downvotes={idea.downvotes || 0}
                      author={idea.authorName}
                      featureImage={idea.featureImage}
                    />
                  </Link>
                ))}
            </div>
            <div className="text-center mt-12">
              <Link to="/browse" className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold py-3 px-6 rounded-full transition-all duration-200 ease-in-out transform hover:-translate-y-px hover:shadow-xl">
                Browse All Ideas
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-yellow-600 dark:text-yellow-300">
                The collaboration loop
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 font-playfair-display">
                How Ideas Move Through The Hive
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                HiveMind turns loose thoughts into public briefs the community can discover, react to, improve, and carry forward.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              {[
                {
                  title: 'Share The Spark',
                  text: 'Capture the rough thought, problem, and possible solution before it disappears into notes.',
                },
                {
                  title: 'Shape A Brief',
                  text: 'Add audience, business model, tags, links, images, and status so others understand the opportunity quickly.',
                },
                {
                  title: 'Invite Signals',
                  text: 'Votes, scores, tags, and discussion-ready pages help promising ideas rise above the noise.',
                },
                {
                  title: 'Find Builders',
                  text: 'A collaborator can discover an idea, sharpen it, prototype it, partner on it, or run with it.',
                },
              ].map((step, index) => (
                <div
                  key={step.title}
                  className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900"
                >
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-yellow-400 text-lg font-bold text-gray-900">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">{step.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 grid gap-6 rounded-md border border-yellow-200 bg-yellow-50 p-6 md:grid-cols-[1fr_auto] md:items-center dark:border-yellow-700/60 dark:bg-yellow-900/20">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  The goal is not just storage. It is momentum.
                </h3>
                <p className="mt-2 text-gray-700 dark:text-gray-300">
                  Share ideas you may never build, improve the ones you understand, and help the best opportunities find the right people.
                </p>
              </div>
              <Link
                to="/how-it-works"
                className="inline-flex justify-center rounded-md bg-gray-900 px-5 py-3 font-semibold text-white transition hover:bg-gray-700 dark:bg-yellow-400 dark:text-gray-900 dark:hover:bg-yellow-300"
              >
                See How It Works
              </Link>
            </div>
          </div>
        </section>

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
                  We're flipping the script. This is a digital idea commons: a space where thoughtful, unfinished, or even half-baked ideas can be shared openly for others to explore, build, and improve.
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
