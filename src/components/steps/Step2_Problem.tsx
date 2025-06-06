import React, { useState } from 'react';

interface StepProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  onSubmit?: () => void;
  isLastStep?: boolean;
}

const problem: React.FC<StepProps> = ({ data, onNext, onBack, onSubmit, isLastStep }) => {
  const [input, setInput] = useState(data['problem'] || '');

  const handleContinue = () => {
    onNext({ 'problem': input });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">What problem does it solve?</h2>
      <textarea
        className="w-full p-4 border rounded-md dark:bg-gray-800 dark:text-white"
        rows={4}
        placeholder="Describe the problem..."
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

export default problem;
