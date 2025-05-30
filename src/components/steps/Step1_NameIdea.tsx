import React, { useState } from 'react';

interface StepProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  onSubmit?: () => void;
  isLastStep?: boolean;
}

const Step1_NameIdea: React.FC<StepProps> = ({ data, onNext, onBack, onSubmit, isLastStep }) => {
  const [input, setInput] = useState(data['Step1_NameIdea'] || '');

  const handleContinue = () => {
    onNext({ 'Step1_NameIdea': input });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Name your idea</h2>
      <textarea
        className="w-full p-4 border rounded-md dark:bg-gray-800 dark:text-white"
        rows={4}
        placeholder="Enter your idea name..."
        value={input}
        onChange={e => setInput(e.target.value)}
      />
      <div className="flex justify-between">
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

export default Step1_NameIdea;
