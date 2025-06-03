import React, { useState, useEffect } from 'react';
import { useOpenAISuggestion } from '../../hooks/useOpenAISuggestion';

interface StepProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  onSubmit?: () => void;
  isLastStep?: boolean;
}

const Step8_MarketSize: React.FC<StepProps> = ({ data, onNext, onBack, onSubmit, isLastStep }) => {
  const [input, setInput] = useState(data['Step8_MarketSize'] || '');
  const { generateSuggestion, loading, error } = useOpenAISuggestion();

  useEffect(() => {
    const fetchSuggestion = async () => {
      if (!data['Step8_MarketSize']) {
        const suggestion = await generateSuggestion('Step8_MarketSize', data);
        if (suggestion) {
          setInput(suggestion);
        }
      }
    };

    fetchSuggestion();
  }, []);

  const handleContinue = () => {
    onNext({ 'Step8_MarketSize': input });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Market Size</h2>

      {loading && <p className="text-sm text-gray-400">Generating AI suggestion...</p>}
      {error && <p className="text-sm text-red-500">AI Error: {error}</p>}

      <textarea
        className="w-full p-4 border rounded-md dark:bg-gray-800 dark:text-white"
        rows={4}
        placeholder="Describe your target market size..."
        value={input}
        onChange={e => setInput(e.target.value)}
      />

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

export default Step8_MarketSize;
