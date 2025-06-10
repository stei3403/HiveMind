import React from 'react';

interface StepProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  onSubmit?: () => void;
  isLastStep?: boolean;
}

const Step6_AIHelp: React.FC<StepProps> = ({ onNext, onBack }) => {
  const handleChoice = (value: string) => {
    onNext({ Step6_AIHelp: value === "Yes" });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Let AI Help?</h2>
      <p className="text-gray-500 dark:text-gray-300">Would you like AI to help fill out the rest?</p>
      <p className="text-gray-500 dark:text-gray-300">✨ Industry</p>
      <p className="text-gray-500 dark:text-gray-300">✨ Market Size</p>
      <p className="text-gray-500 dark:text-gray-300">✨ Business Model</p>
      <p className="text-gray-500 dark:text-gray-300">✨ Team</p>
      <p className="text-gray-500 dark:text-gray-300">✨ Tags</p>
      <p className="text-gray-500 dark:text-gray-300">(You can review and make changes prior to submitting)</p>

      <div className="space-y-4">
        <button
          onClick={() => handleChoice('Yes')}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-3 rounded-full"
        >
          Yes, enhance my idea
        </button>

        <button
          onClick={() => handleChoice('No')}
          className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-semibold py-3 rounded-full"
        >
          No, I’ll add details myself
        </button>
      </div>

      <div className="pt-4">
        <button onClick={onBack} className="text-gray-600 dark:text-gray-300">Back</button>
      </div>
    </div>
  );
};

export default Step6_AIHelp;
