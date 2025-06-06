import React, { useState } from 'react';
import { useOpenAISuggestion } from '../../hooks/useOpenAISuggestion';

interface StepProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  onSubmit?: () => void;
  isLastStep?: boolean;
}

const FIELD_NAME = 'businessModel';

const businessModel: React.FC<StepProps> = ({ data, onNext, onBack }) => {
  const [businessModel, setBusinessModel] = useState(data[FIELD_NAME] || '');
  const { generateSuggestion, loading, error } = useOpenAISuggestion();

  const handleAISuggestion = async () => {
    const suggestion = await generateSuggestion(FIELD_NAME, data);
    if (suggestion) {
      setBusinessModel(suggestion);
    }
  };

  const handleContinue = () => {
    onNext({ [FIELD_NAME]: businessModel });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Business Model</h2>
      <p className="text-gray-500 dark:text-gray-300">
        Briefly describe how your idea will generate revenue.
      </p>

      <textarea
        className="w-full p-4 border rounded-md dark:bg-gray-800 dark:text-white"
        rows={4}
        placeholder="e.g., Subscription fees, affiliate marketing, in-app purchases, licensing, etc."
        value={businessModel}
        onChange={e => setBusinessModel(e.target.value)}
      />

      <button
        onClick={handleAISuggestion}
        className="text-sm text-blue-600 underline"
        disabled={loading}
      >
        {loading ? 'Generating suggestion...' : 'Get AI Suggestion'}
      </button>

      {error && <p className="text-sm text-red-500">AI Error: {error}</p>}

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

export default businessModel;
