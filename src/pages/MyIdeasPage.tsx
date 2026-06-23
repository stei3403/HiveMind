import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { IdeaRecord } from '../types/formTypes';

const formatDate = (value: unknown) => {
  if (!value) return 'Unknown';

  if (typeof value === 'object' && value !== null && 'toDate' in value) {
    return (value as { toDate: () => Date }).toDate().toLocaleDateString();
  }

  return 'Unknown';
};

const MyIdeasPage: React.FC = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [ideas, setIdeas] = useState<IdeaRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIdeas = async () => {
      if (!user) return;

      try {
        const snapshot = await getDocs(collection(db, 'ideas'));
        const allIdeas = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as IdeaRecord[];

        setIdeas(allIdeas);
      } catch (error) {
        console.error('Error loading ideas:', error);
        toast.error('Unable to load ideas.');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchIdeas();
    }
  }, [authLoading, user]);

  const visibleIdeas = useMemo(() => {
    const scopedIdeas = isAdmin ? ideas : ideas.filter(idea => idea.authorUid === user?.uid);

    return scopedIdeas.sort((a, b) => {
      const aDate = typeof a.createdAt === 'object' && a.createdAt && 'toMillis' in a.createdAt
        ? (a.createdAt as { toMillis: () => number }).toMillis()
        : 0;
      const bDate = typeof b.createdAt === 'object' && b.createdAt && 'toMillis' in b.createdAt
        ? (b.createdAt as { toMillis: () => number }).toMillis()
        : 0;

      return bDate - aDate;
    });
  }, [ideas, isAdmin, user?.uid]);

  if (authLoading || loading) {
    return <div className="p-6 text-center text-gray-600 dark:text-gray-300">Loading...</div>;
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 text-gray-800 dark:text-white">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">{isAdmin ? 'Manage Ideas' : 'My Ideas'}</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            {isAdmin
              ? 'Review and edit every idea in the database.'
              : 'Review and edit the ideas you have submitted.'}
          </p>
        </div>

        <Link
          to="/submit"
          className="inline-flex justify-center rounded-md bg-yellow-400 px-4 py-2 font-semibold text-white hover:bg-yellow-500"
        >
          Submit Idea
        </Link>
      </div>

      {visibleIdeas.length === 0 ? (
        <div className="rounded-md border border-gray-200 dark:border-gray-700 p-8 text-center">
          <p className="text-gray-600 dark:text-gray-300">No ideas found yet.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
          <div className="hidden md:grid grid-cols-[1fr_10rem_10rem_9rem] gap-4 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-sm font-semibold">
            <span>Idea</span>
            <span>Status</span>
            <span>Created</span>
            <span className="text-right">Actions</span>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {visibleIdeas.map(idea => (
              <div key={idea.id} className="grid grid-cols-1 md:grid-cols-[1fr_10rem_10rem_9rem] gap-3 px-4 py-4">
                <div className="min-w-0">
                  <Link to={`/idea/${idea.id}`} className="font-semibold hover:text-yellow-500">
                    {idea.title || 'Untitled idea'}
                  </Link>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
                    {idea.problem || 'No problem statement yet.'}
                  </p>
                  {isAdmin && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {idea.authorName || 'Anonymous'}
                    </p>
                  )}
                </div>

                <div className="text-sm text-gray-700 dark:text-gray-200">
                  {idea.status || 'Just an Idea'}
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {formatDate(idea.createdAt)}
                </div>

                <div className="flex md:justify-end gap-2">
                  <Link
                    to={`/idea/${idea.id}`}
                    className="rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm font-semibold"
                  >
                    View
                  </Link>
                  <Link
                    to={`/idea/${idea.id}/edit`}
                    className="rounded-md bg-yellow-400 px-3 py-2 text-sm font-semibold text-white hover:bg-yellow-500"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
};

export default MyIdeasPage;
