import React, { useState, useEffect } from 'react';
import { useOpenAISuggestion } from '../../hooks/useOpenAISuggestion';

interface StepProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  onSubmit?: () => void;
  isLastStep?: boolean;
}

const FIELD_NAME = 'team';

const Step10_Team: React.FC<StepProps> = ({ data, onNext, onBack }) => {
  const [team, setTeam] = useState(data[FIELD_NAME] || '');
  const { generateSuggestion, loading } = useOpenAISuggestion();

  useEffect(() => {
    const fetchSuggestion = async () => {
      if (!team) {
        const suggestion = await generateSuggestion(FIELD_NAME, data);
        if (suggestion) setTeam(suggestion);
      }
    };
    fetchSuggestion();
  }, []);

  const handleContinue = () => {
    onNext({ [FIELD_NAME]: team });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Team Composition</h2>
      <p className="text-gray-500 dark:text-gray-300">
        Describe the key roles needed to launch and operate this idea. 
        For example: founder, developer, designer, marketer, etc.
      </p>
      <textarea
        className="w-full p-4 border rounded-md dark:bg-gray-800 dark:text-white"
        rows={4}
        placeholder="e.g., 1 founder, 1 frontend developer, 1 backend developer, 1 marketing lead"
        value={team}
        onChange={e => setTeam(e.target.value)}
      />
      {loading && (
        <p className="text-sm text-gray-400">✨ Generating AI suggestion...</p>
      )}
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

export default Step10_Team;
