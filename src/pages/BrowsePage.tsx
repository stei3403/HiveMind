import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import IdeaCard from '../components/IdeaCard';
import { Link } from 'react-router-dom';

type Idea = {
  id: string;
  title: string;
  problem: string;
  solution: string;
  status: string;
  upvotes: number;
  authorName: string;
  tags?: string[];
  featureImage?: string;
};

const BrowsePage = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [filteredIdeas, setFilteredIdeas] = useState<Idea[]>([]);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortDescending, setSortDescending] = useState(true);

  // Unique tag list (built dynamically from ideas)
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchIdeas = async () => {
      const querySnapshot = await getDocs(collection(db, 'ideas'));
      const ideasData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Idea[];

      setIdeas(ideasData);
      setFilteredIdeas(ideasData);

      // Collect all unique tags
      const tags = new Set<string>();
      ideasData.forEach(idea => idea.tags?.forEach(tag => tags.add(tag)));
      setAllTags([...tags]);
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

    // Sort by upvotes
    updatedIdeas.sort((a, b) =>
      sortDescending ? b.upvotes - a.upvotes : a.upvotes - b.upvotes
    );

    setFilteredIdeas(updatedIdeas);
  }, [ideas, searchQuery, selectedTags, selectedStatus, sortDescending]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 text-center">Browse Ideas</h1>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        {/* Search */}
        <input
          type="text"
          placeholder="Search ideas..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 dark:bg-gray-800 dark:text-white"
        />

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {allTags.map(tag => (
            <label
              key={tag}
              className={`px-3 py-1 border rounded-full cursor-pointer text-sm ${
                selectedTags.includes(tag)
                  ? 'bg-yellow-400 text-white'
                  : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
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

        {/* Status + Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="w-full sm:w-auto border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 dark:bg-gray-800 dark:text-white"
          >
            <option value="">All Statuses</option>
            <option value="Just an Idea">Just an Idea</option>
            <option value="Researching">Researching</option>
            <option value="Currently Building">Currently Building</option>
            <option value="Built and Launched">Built and Launched</option>
            <option value="Iterating and Improving">Iterating and Improving</option>
          </select>

          <button
            onClick={() => setSortDescending(prev => !prev)}
            className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded-full"
          >
            Sort by Upvotes {sortDescending ? '↓' : '↑'}
          </button>
        </div>
      </div>

      {/* Idea Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIdeas.map(idea => (
          <Link to={`/idea/${idea.id}`} key={idea.id}>
            <IdeaCard
              title={idea.title}
              problem={idea.problem}
              solution={idea.solution}
              category={idea.tags?.[0] || ''}
              status={idea.status}
              upvotes={idea.upvotes}
              author={idea.authorName}
              featureImage={idea.featureImage}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BrowsePage;
