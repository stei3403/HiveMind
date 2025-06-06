import React, { useState } from 'react';
import { useOpenAISuggestion } from '../../hooks/useOpenAISuggestion';

interface StepProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  onSubmit?: () => void;
  isLastStep?: boolean;
}

const marketSize: React.FC<StepProps> = ({ data, onNext, onBack, onSubmit, isLastStep }) => {
  const [input, setInput] = useState(data['marketSize'] || '');
  const { generateSuggestion, loading, error } = useOpenAISuggestion();

  const handleAISuggestion = async () => {
    const suggestion = await generateSuggestion('marketSize', data);
    if (suggestion) {
      setInput(suggestion);
    }
  };

  const handleContinue = () => {
    onNext({ 'marketSize': input });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Market Size</h2>

      <textarea
        className="w-full p-4 border rounded-md dark:bg-gray-800 dark:text-white"
        rows={4}
        placeholder="Describe your target market size..."
        value={input}
        onChange={e => setInput(e.target.value)}
      />

      <button
        onClick={handleAISuggestion}
        className="text-sm text-blue-600 underline"
        disabled={loading}
      >
        {loading ? 'Generating suggestion...' : 'Get AI Suggestion'}
      </button>

      {error && <p className="text-sm text-red-500">AI Error: {error}</p>}

      <div className="flex justify-between">
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

export default marketSize;
