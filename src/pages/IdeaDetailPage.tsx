import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { IdeaRecord, IdeaStatus } from '../types/formTypes';
import { getIdeaScore, getUserVote, setUserVote, VoteValue } from '../services/votes';

const statusClasses: Record<IdeaStatus, string> = {
  'Just an Idea': 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700',
  'Researching': 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-900',
  'Currently Building': 'bg-yellow-100 text-yellow-900 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-200 dark:border-yellow-900',
  'Built and Launched': 'bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-200 dark:border-green-900',
  'Iterating and Improving': 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950 dark:text-purple-200 dark:border-purple-900',
};

const chipClass = 'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold';

const parseLinks = (links?: string) =>
  (links || '')
    .split(/\r?\n|,\s*/)
    .map(link => link.trim())
    .filter(Boolean);

const getLinkHref = (link: string) =>
  /^https?:\/\//i.test(link) ? link : `https://${link}`;

type SectionProps = {
  title: string;
  children: React.ReactNode;
};

const DetailSection: React.FC<SectionProps> = ({ title, children }) => (
  <section className="rounded-md border border-gray-200 dark:border-gray-700 p-5 bg-white dark:bg-gray-900">
    <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">
      {title}
    </h2>
    <div className="text-gray-800 dark:text-gray-100 whitespace-pre-wrap leading-relaxed">{children}</div>
  </section>
);

const IdeaDetailPage: React.FC = () => {
  const { id } = useParams();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [idea, setIdea] = useState<IdeaRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [userVote, setUserVoteState] = useState<VoteValue>(0);
  const [voting, setVoting] = useState(false);

  useEffect(() => {
    const fetchIdea = async () => {
      if (!id) return;

      try {
        const docRef = doc(db, 'ideas', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setIdea({ id: docSnap.id, ...docSnap.data() } as IdeaRecord);
        } else {
          console.error('Idea not found');
        }
      } catch (err) {
        console.error('Error fetching idea:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchIdea();
  }, [id]);

  useEffect(() => {
    const fetchVote = async () => {
      if (!id || !user) {
        setUserVoteState(0);
        return;
      }

      try {
        setUserVoteState(await getUserVote(id, user.uid));
      } catch (error) {
        console.error('Error loading vote:', error);
      }
    };

    fetchVote();
  }, [id, user]);

  const handleVote = async (vote: VoteValue) => {
    if (!id || !user) {
      toast.error('Please log in before voting.');
      return;
    }

    const nextVote = userVote === vote ? 0 : vote;
    setVoting(true);

    try {
      const result = await setUserVote(id, user.uid, nextVote);
      setUserVoteState(result.userVote);
      setIdea(prev => prev ? {
        ...prev,
        upvotes: result.upvotes,
        downvotes: result.downvotes,
        score: result.score,
      } : prev);
    } catch (error) {
      console.error('Error saving vote:', error);
      toast.error('Unable to save vote.');
    } finally {
      setVoting(false);
    }
  };

  if (loading || authLoading) return <div className="text-center p-6">Loading...</div>;
  if (!idea) return <div className="text-center p-6 text-red-600">Idea not found.</div>;

  const canEdit = !!user && (isAdmin || idea.authorUid === user.uid);
  const score = getIdeaScore(idea);
  const status = idea.status || 'Just an Idea';
  const links = parseLinks(idea.links);

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 text-gray-800 dark:text-white">
      <img
        src={idea.featureImage || '/No Image Available Placeholder.png'}
        alt=""
        className="w-full h-72 object-cover rounded-md mb-6 border border-gray-200 dark:border-gray-700"
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = '/No Image Available Placeholder.png';
        }}
      />

      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-6">
        <div className="min-w-0">
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">{idea.title}</h1>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className={`${chipClass} ${statusClasses[status]}`}>
              {status}
            </span>
            {(idea.tags || []).map(tag => (
              <span
                key={tag}
                className={`${chipClass} bg-yellow-50 text-yellow-900 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-200 dark:border-yellow-900`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {canEdit && id && (
          <Link
            to={`/idea/${id}/edit`}
            className="inline-flex justify-center rounded-md bg-yellow-400 px-4 py-2 text-sm font-semibold text-white hover:bg-yellow-500"
          >
            Edit Idea
          </Link>
        )}
      </div>

      <div className="mb-8 flex flex-col sm:flex-row sm:items-center gap-3 rounded-md border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleVote(1)}
            disabled={voting}
            className={`rounded-md border px-3 py-2 font-semibold ${
              userVote === 1
                ? 'bg-green-600 border-green-600 text-white'
                : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
            } disabled:opacity-60`}
          >
            Upvote
          </button>
          <button
            type="button"
            onClick={() => handleVote(-1)}
            disabled={voting}
            className={`rounded-md border px-3 py-2 font-semibold ${
              userVote === -1
                ? 'bg-red-600 border-red-600 text-white'
                : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
            } disabled:opacity-60`}
          >
            Downvote
          </button>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-300">
          <span className="font-semibold text-gray-900 dark:text-white">{score}</span> score
          <span className="mx-2">/</span>
          {idea.upvotes || 0} up
          <span className="mx-2">/</span>
          {idea.downvotes || 0} down
          {(idea.adminScoreAdjustment || 0) !== 0 && isAdmin && (
            <span className="ml-2 text-blue-600 dark:text-blue-300">
              admin {idea.adminScoreAdjustment && idea.adminScoreAdjustment > 0 ? '+' : ''}{idea.adminScoreAdjustment}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5">
        <DetailSection title="Problem">{idea.problem}</DetailSection>
        <DetailSection title="Solution">{idea.solution}</DetailSection>

        {idea.targetAudience && (
          <DetailSection title="Target Audience">{idea.targetAudience}</DetailSection>
        )}

        {idea.businessModel && (
          <DetailSection title="Business Model">{idea.businessModel}</DetailSection>
        )}

        {idea.whyNow && (
          <DetailSection title="Why Now">{idea.whyNow}</DetailSection>
        )}

        {idea.marketSize && (
          <DetailSection title="Market Size">{idea.marketSize}</DetailSection>
        )}

        {(idea.features?.length || 0) > 0 && (
          <DetailSection title="Features">
            <div className="flex flex-wrap gap-2">
              {idea.features?.map(feature => (
                <span
                  key={feature}
                  className={`${chipClass} bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-900`}
                >
                  {feature}
                </span>
              ))}
            </div>
          </DetailSection>
        )}

        {(idea.industry?.length || 0) > 0 && (
          <DetailSection title="Industries">
            <div className="flex flex-wrap gap-2">
              {idea.industry?.map(industry => (
                <span
                  key={industry}
                  className={`${chipClass} bg-green-50 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-200 dark:border-green-900`}
                >
                  {industry}
                </span>
              ))}
            </div>
          </DetailSection>
        )}

        {idea.team && (
          <DetailSection title="Team">{idea.team}</DetailSection>
        )}

        {links.length > 0 && (
          <DetailSection title="Links">
            <div className="space-y-2">
              {links.map(link => (
                <a
                  key={link}
                  href={getLinkHref(link)}
                  target="_blank"
                  rel="noreferrer"
                  className="block break-all text-blue-600 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-200 underline"
                >
                  {link}
                </a>
              ))}
            </div>
          </DetailSection>
        )}

        {(idea.images?.length || 0) > 1 && (
          <DetailSection title="Gallery">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {idea.images?.slice(1).map((url: string, idx: number) => (
                <img
                  key={url}
                  src={url}
                  alt={`Idea gallery ${idx + 1}`}
                  className="w-full h-32 object-cover rounded-md border border-gray-200 dark:border-gray-700"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = '/No Image Available Placeholder.png';
                  }}
                />
              ))}
            </div>
          </DetailSection>
        )}
      </div>
    </main>
  );
};

export default IdeaDetailPage;
