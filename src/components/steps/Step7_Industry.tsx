import React, { useState } from 'react';
import { StepProps } from '../../types/formTypes';
import { useOpenAISuggestion } from '../../hooks/useOpenAISuggestion';

const INDUSTRY_OPTIONS = [
  'AI / Machine Learning',
  'SaaS',
  'E-commerce',
  'Healthcare',
  'Finance',
  'Education',
  'Real Estate',
  'Marketing',
  'Developer Tools',
  'Cybersecurity',
  'Entertainment',
  'Transportation',
  'Retail',
  'Social Impact',
  'Web3 / Blockchain',
  'Gaming',
  'Climate / Sustainability',
  'Clean Energy',
  'Insurance / Insurtech',
  'Legal / Legaltech',
  'Marketplace Platforms',
  'Agriculture / AgTech',
  'Food & Beverage',
  'Supply Chain / Logistics',
  'HR / Recruiting',
  'AR / VR / Spatial Computing',
  'Real-time Collaboration Tools',
  'Fitness / Wellness',
  'Mental Health',
  'Creator Economy',
  'Open Source Tools',
  'IoT / Connected Devices',
  'Aerospace / Drones',
  'Manufacturing / Robotics',
  'Mobility / EVs',
  'Telecommunications',
  'Data & Analytics',
  'GovTech / Civic Tech',
  'Media / Publishing',
  'Fashion / Apparel',
  'Pet Tech',
  'Elder Care / Aging Tech',
  'Nonprofit / Philanthropy',
  'Parenting / Childcare',
  'Construction / PropTech',
  'Finance - DeFi / Crypto',
  'Healthcare - Biotech / Medtech',
];

const Step8_Industry: React.FC<StepProps> = ({ data, onNext, onBack }) => {
  const [selectedTags, setSelectedTags] = useState<string[]>(data.industry || []);
  const [showAll, setShowAll] = useState(false);
  const { generateSuggestion, loading, error } = useOpenAISuggestion();

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleAISuggestion = async () => {
    const suggestion = await generateSuggestion("industry", data);
    if (suggestion) {
      const matchedTags = INDUSTRY_OPTIONS.filter(option =>
        suggestion.toLowerCase().includes(option.toLowerCase())
      );
      setSelectedTags(matchedTags);
    }
  };

  const handleContinue = () => {
    onNext({ industry: selectedTags });
  };

  const displayedTags = showAll ? INDUSTRY_OPTIONS : INDUSTRY_OPTIONS.slice(0, 14); // top 14 are common ones

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
        Select Relevant Industries
      </h2>
      <p className="text-gray-500 dark:text-gray-300">
        Pick one or more industries that apply to your idea.
      </p>

      {loading && <p className="text-sm text-gray-400">Generating AI suggestion...</p>}
      {error && <p className="text-sm text-red-500">AI Error: {error}</p>}

      <button
        onClick={handleAISuggestion}
        className="text-sm underline text-blue-500 hover:text-blue-600"
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Get AI Suggestion'}
      </button>

      <div className="flex flex-wrap gap-2">
        {displayedTags.map((tag) => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`px-4 py-2 rounded-full border text-sm font-medium transition ${
              selectedTags.includes(tag)
                ? 'bg-yellow-400 text-white border-yellow-400'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <button
        onClick={() => setShowAll(!showAll)}
        className="mt-2 text-sm text-blue-600 hover:underline"
      >
        {showAll ? 'Show Less' : 'View More'}
      </button>

      <div className="flex justify-between pt-6">
        <button onClick={onBack} className="text-gray-600 dark:text-gray-300">
          Back
        </button>
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

export default Step8_Industry;
