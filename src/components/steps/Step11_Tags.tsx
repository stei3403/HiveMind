import React, { useEffect, useState } from 'react';
import { useOpenAISuggestion } from '../../hooks/useOpenAISuggestion';

interface StepProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  isLastStep?: boolean;
  onSubmit?: () => void;
}

const categorizedTags = {
  Topics: ['Productivity', 'Finance', 'Education', 'Mental Health', 'Social Media', 'Parenting', 'Remote Work', 'Automation', 'Fitness', 'AI/ML', 'Sustainability'],
  Audience: ['Students', 'Freelancers', 'Parents', 'Teachers', 'Gen Z', 'Startups', 'Enterprise'],
  Features: ['No-Code', 'Blockchain', 'Voice UI', 'Chatbot', 'Recommendation Engine', 'Crowdsourced', 'Real-time', 'Gamified', 'Mobile-first', 'API']
};

const FIELD_NAME = 'Step11_Tags';

const Step11_Tags: React.FC<StepProps> = ({ data, onNext, onBack }) => {
  const initialTags = Array.isArray(data[FIELD_NAME]) ? data[FIELD_NAME] : [];
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);
  const [searchInput, setSearchInput] = useState('');
  const [error, setError] = useState('');
  const { generateSuggestion, loading } = useOpenAISuggestion();

  const allTags = Object.values(categorizedTags).flat();

  // Fetch AI suggestion on first load if no tags are selected
  useEffect(() => {
    const fetchSuggestion = async () => {
      if (selectedTags.length === 0) {
        const suggestion = await generateSuggestion(FIELD_NAME, data);
        if (Array.isArray(suggestion)) {
          setSelectedTags(suggestion.slice(0, 5));
        } else if (typeof suggestion === 'string') {
          const tags = suggestion.split(',').map(tag => tag.trim()).slice(0, 5);
          setSelectedTags(tags);
        }
      }
    };
    fetchSuggestion();
  }, []);

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
      setError('');
    } else if (selectedTags.length >= 5) {
      setError('You can select up to 5 tags.');
    } else {
      setSelectedTags([...selectedTags, tag]);
      setError('');
    }
  };

  const handleCustomTag = () => {
    const trimmed = searchInput.trim();
    if (trimmed && !allTags.includes(trimmed) && !selectedTags.includes(trimmed)) {
      if (selectedTags.length >= 5) {
        setError('You can select up to 5 tags.');
      } else {
        setSelectedTags([...selectedTags, trimmed]);
        setError('');
      }
    }
    setSearchInput('');
  };

  const handleContinue = () => {
    onNext({ [FIELD_NAME]: selectedTags });
  };

  const filteredTags = allTags.filter(tag =>
    tag.toLowerCase().includes(searchInput.toLowerCase()) && !selectedTags.includes(tag)
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Add Tags</h2>
      <p className="text-gray-600 dark:text-gray-300">Select up to 5 tags that best describe your idea.</p>

      <div className="flex gap-2">
        <input
          type="text"
          className="w-full border px-4 py-2 rounded dark:bg-gray-800 dark:text-white"
          placeholder="Search or add your own..."
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleCustomTag()}
        />
        <button
          onClick={handleCustomTag}
          className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {loading && <p className="text-sm text-gray-400">✨ Generating AI suggestion...</p>}

      <div className="flex flex-wrap gap-2">
        {selectedTags.map(tag => (
          <span
            key={tag}
            className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
          >
            {tag}
            <button onClick={() => handleTagToggle(tag)} className="text-xs">✕</button>
          </span>
        ))}
      </div>

      {Object.entries(categorizedTags).map(([category, tags]) => (
        <div key={category}>
          <h4 className="text-sm font-semibold text-gray-500 mt-4 mb-2 dark:text-gray-300">{category}</h4>
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <button
                key={tag}
                className={`px-3 py-1 rounded-full border text-sm ${
                  selectedTags.includes(tag)
                    ? 'bg-yellow-400 text-white'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-white'
                }`}
                onClick={() => handleTagToggle(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="flex justify-between pt-6">
        <button onClick={onBack} className="text-gray-600 dark:text-gray-300">Back</button>
        <button
          onClick={handleContinue}
          className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-6 py-2 rounded-full shadow"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Step11_Tags;
