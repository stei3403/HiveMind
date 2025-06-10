import React, { useState } from 'react';

interface StepProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  onSubmit?: () => void;
  isLastStep?: boolean;
}

const Step1_Title: React.FC<StepProps> = ({ data, onNext, onBack }) => {
  const [input, setInput] = useState(data.title || '');

  const handleContinue = () => {
    onNext({ title: input });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Name your idea</h2>
      <textarea
        className="w-full p-4 border rounded-md dark:bg-gray-800 dark:text-white"
        rows={1}
        placeholder="Enter your idea title..."
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

export default Step1_Title;
