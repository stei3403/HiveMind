import React, { useState } from 'react';

interface StepProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  isLastStep?: boolean;
  onSubmit?: () => void;
}

const statusOptions = [
  'Just an Idea',
  'Researching',
  'Currently Building',
  'Built and Launched',
  'Iterating and Improving',
];

const status: React.FC<StepProps> = ({ data, onNext, onBack }) => {
  const initialIndex = statusOptions.indexOf(data.status) || 0;
  const [sliderValue, setSliderValue] = useState(initialIndex);

  const handleContinue = () => {
    onNext({ status: statusOptions[sliderValue] });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">What's the current status?</h2>

      <div className="flex flex-col items-center space-y-4">
        <div className="text-lg font-medium text-yellow-600 dark:text-yellow-300">
          {statusOptions[sliderValue]}
        </div>

        <input
          type="range"
          min={0}
          max={statusOptions.length - 1}
          step={1}
          value={sliderValue}
          onChange={(e) => setSliderValue(Number(e.target.value))}
          className="w-full accent-yellow-400"
        />

        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 w-full">
          {statusOptions.map((label, i) => (
            <span key={i} className={i === sliderValue ? 'text-yellow-600 font-semibold' : ''}>
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="flex justify-between pt-4">
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

export default status;
