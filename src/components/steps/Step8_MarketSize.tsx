import React, { useState } from 'react';

interface StepProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  onSubmit?: () => void;
  isLastStep?: boolean;
}

const Step8_MarketSize: React.FC<StepProps> = ({ data, onNext, onBack, onSubmit, isLastStep }) => {
  const [input, setInput] = useState(data['Step8_MarketSize'] || '');

  const handleContinue = () => {
    onNext({ 'Step8_MarketSize': input });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Market Size</h2>
      <textarea
        className="w-full p-4 border rounded-md dark:bg-gray-800 dark:text-white"
        rows={4}
        placeholder="Choose target market scale"
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

export default Step8_MarketSize;
