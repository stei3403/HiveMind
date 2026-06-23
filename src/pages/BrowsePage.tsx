import React, { useEffect, useMemo, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import IdeaCard from '../components/IdeaCard';
import { Link } from 'react-router-dom';
import { IdeaRecord, IdeaStatus } from '../types/formTypes';
import { getIdeaScore } from '../services/votes';

const statusOptions: IdeaStatus[] = [
  'Just an Idea',
  'Researching',
  'Currently Building',
  'Built and Launched',
  'Iterating and Improving',
];

const defaultVisibleTagCount = 18;

const BrowsePage = () => {
  const [ideas, setIdeas] = useState<IdeaRecord[]>([]);
  const [filteredIdeas, setFilteredIdeas] = useState<IdeaRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortDescending, setSortDescending] = useState(true);
  const [showAllTags, setShowAllTags] = useState(false);

  // Unique tag list (built dynamically from ideas)
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'ideas'));
        const ideasData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as IdeaRecord[];

        setIdeas(ideasData);
        setFilteredIdeas(ideasData);

        // Collect tags by popularity so the filter starts with the most useful options.
        const tagCounts = new Map<string, number>();
        ideasData.forEach(idea => {
          idea.tags?.forEach(tag => tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1));
        });
        setAllTags(
          [...tagCounts.entries()]
            .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
            .map(([tag]) => tag)
        );
      } catch (error) {
        console.error('Error fetching ideas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIdeas();
  }, []);

  useEffect(() => {
    let updatedIdeas = [...ideas];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      updatedIdeas = updatedIdeas.filter(
        idea =>
          idea.title?.toLowerCase().includes(query) ||
          idea.problem?.toLowerCase().includes(query) ||
          idea.solution?.toLowerCase().includes(query) ||
          idea.authorName?.toLowerCase().includes(query)
      );
    }

    // Tag filter
    if (selectedTags.length > 0) {
      updatedIdeas = updatedIdeas.filter(idea =>
        idea.tags?.some(tag => selectedTags.includes(tag))
      );
    }

    // Status filter
    if (selectedStatus) {
      updatedIdeas = updatedIdeas.filter(idea => idea.status === selectedStatus);
    }

    // Sort by score
    updatedIdeas.sort((a, b) =>
      sortDescending ? getIdeaScore(b) - getIdeaScore(a) : getIdeaScore(a) - getIdeaScore(b)
    );

    setFilteredIdeas(updatedIdeas);
  }, [ideas, searchQuery, selectedTags, selectedStatus, sortDescending]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const visibleTags = useMemo(() => {
    if (showAllTags || allTags.length <= defaultVisibleTagCount) return allTags;

    const popularTags = allTags.slice(0, defaultVisibleTagCount);
    const selectedHiddenTags = selectedTags.filter(tag => !popularTags.includes(tag));
    return [...popularTags, ...selectedHiddenTags];
  }, [allTags, selectedTags, showAllTags]);

  const hiddenTagCount = Math.max(allTags.length - defaultVisibleTagCount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-white to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-yellow-700 dark:text-yellow-300">
            Idea Library
          </p>
          <h1 className="mt-2 text-4xl font-bold text-gray-950 dark:text-white">Browse Ideas</h1>
          <p className="mx-auto mt-3 max-w-2xl text-gray-700 dark:text-gray-300">
            Search the database, filter by the most common tags, and use score to find the ideas with the most momentum.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-5 rounded-md border border-yellow-200 bg-white/90 p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900/90">
          {/* Search */}
          <input
            type="text"
            placeholder="Search ideas..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-4 py-3 text-gray-900 shadow-sm outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 dark:bg-gray-800 dark:text-white dark:focus:ring-yellow-900"
          />

          {/* Tags */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
                  Popular Tags
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {loading ? 'Loading popular tags...' : `Showing ${visibleTags.length} of ${allTags.length} tags.`}
                </p>
              </div>
              {selectedTags.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedTags([])}
                  className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  Clear Tags
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {loading && (
                <>
                  {[1, 2, 3, 4, 5, 6].map(item => (
                    <span
                      key={item}
                      className="h-8 w-24 animate-pulse rounded-full bg-gray-100 dark:bg-gray-800"
                      aria-hidden="true"
                    />
                  ))}
                </>
              )}
              {!loading && visibleTags.map(tag => (
                <label
                  key={tag}
                  className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
                    selectedTags.includes(tag)
                      ? 'border-yellow-500 bg-yellow-400 text-gray-950 shadow-sm'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-yellow-400 hover:bg-yellow-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-yellow-500 dark:hover:bg-gray-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(tag)}
                    onChange={() => handleTagToggle(tag)}
                    className="hidden"
                  />
                  {tag}
                </label>
              ))}
            </div>
            {!loading && hiddenTagCount > 0 && (
              <button
                type="button"
                onClick={() => setShowAllTags(prev => !prev)}
                className="rounded-md border border-yellow-300 bg-yellow-50 px-3 py-2 text-sm font-semibold text-yellow-900 transition hover:bg-yellow-100 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200 dark:hover:bg-yellow-900"
              >
                {showAllTags ? 'Show fewer tags' : `Show ${hiddenTagCount} more tags`}
              </button>
            )}
          </div>

          {/* Status + Sort */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full sm:w-auto border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2.5 text-gray-900 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 dark:bg-gray-800 dark:text-white dark:focus:ring-yellow-900"
            >
              <option value="">All Statuses</option>
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            <button
              onClick={() => setSortDescending(prev => !prev)}
              className="px-4 py-2.5 bg-gray-950 hover:bg-gray-800 text-white font-semibold rounded-md shadow-sm dark:bg-yellow-400 dark:text-gray-950 dark:hover:bg-yellow-300"
            >
              Sort by Score {sortDescending ? 'Down' : 'Up'}
            </button>
          </div>
        </div>

        {/* Idea Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(item => (
              <div
                key={item}
                className="h-96 animate-pulse rounded-md border border-gray-200 bg-white/80 shadow-sm dark:border-gray-700 dark:bg-gray-800"
              />
            ))}
          </div>
        ) : filteredIdeas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIdeas.map(idea => (
              <Link to={`/idea/${idea.id}`} key={idea.id}>
                <IdeaCard
                  title={idea.title || 'Untitled idea'}
                  problem={idea.problem || ''}
                  solution={idea.solution || ''}
                  category={idea.tags?.[0] || ''}
                  status={idea.status || 'Just an Idea'}
                  score={getIdeaScore(idea)}
                  upvotes={idea.upvotes || 0}
                  downvotes={idea.downvotes || 0}
                  author={idea.authorName || 'Anonymous'}
                  featureImage={idea.featureImage}
                />
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-gray-300 bg-white/80 p-8 text-center text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
            No ideas match those filters yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowsePage;
