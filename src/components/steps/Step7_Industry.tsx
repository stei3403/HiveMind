import React, { useState } from 'react';

interface StepProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  onSubmit?: () => void;
  isLastStep?: boolean;
}

const INDUSTRY_OPTIONS = [
  'Finance',
  'Healthcare',
  'Education',
  'E-commerce',
  'Entertainment',
  'Real Estate',
  'Transportation',
  'Travel',
  'SaaS',
  'Marketing',
  'Retail',
  'AI / Machine Learning',
  'Developer Tools',
  'Social Impact',
];

const Step7_Industry: React.FC<StepProps> = ({ data, onNext, onBack }) => {
  const [selectedTags, setSelectedTags] = useState<string[]>(data.Step7_Industry || []);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleContinue = () => {
    onNext({ Step7_Industry: selectedTags });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Select Relevant Industries</h2>
      <p className="text-gray-500 dark:text-gray-300">Pick one or more industries that apply to your idea.</p>

      <div className="flex flex-wrap gap-2">
        {INDUSTRY_OPTIONS.map((tag) => (
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

export default Step7_Industry;
