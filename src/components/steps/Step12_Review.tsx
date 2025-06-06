import React, { useState } from 'react';
import { useOpenAISuggestion } from '../../hooks/useOpenAISuggestion';
import toast from 'react-hot-toast';

interface StepProps {
  data: any;
  onBack: () => void;
  onSubmit: () => void;
  onNext: (data: any) => void; // used to update formData when editing fields
  isLastStep?: boolean;
}

const fieldConfig = [
  { key: 'name', label: 'Idea Name', type: 'input', aiField: 'name' },
  { key: 'problem', label: 'Problem', type: 'textarea', aiField: 'problem' },
  { key: 'solution', label: 'Solution', type: 'textarea', aiField: 'solution' },
  { key: 'status', label: 'Current Status', type: 'input', aiField: 'status' },
  { key: 'links', label: 'Project Links', type: 'input', aiField: 'links' },
  { key: 'industry', label: 'Industry', type: 'input', aiField: 'industry' },
  { key: 'marketSize', label: 'Market Size', type: 'textarea', aiField: 'marketSize' },
  { key: 'businessModel', label: 'Business Model', type: 'textarea', aiField: 'businessModel' },
  { key: 'team', label: 'Team Composition', type: 'textarea', aiField: 'team' },
  { key: 'tags', label: 'Tags', type: 'input', aiField: 'tags' },
];

const Step12_Review: React.FC<StepProps> = ({ data, onBack, onSubmit, onNext }) => {
  const [editing, setEditing] = useState<string | null>(null);
  const [localData, setLocalData] = useState<any>(data);
  const { generateSuggestion } = useOpenAISuggestion();

  const handleChange = (key: string, value: string) => {
    setLocalData((prev: any) => ({ ...prev, [key]: value }));
    onNext({ [key]: value });
  };

  const handleAIFill = async (key: string, aiField: string) => {
    toast.loading(`Getting suggestion for ${aiField}...`);
    try {
      const result = await generateSuggestion(aiField, localData);
      if (result && typeof result === 'string') {
        handleChange(key, result);
        toast.dismiss();
        toast.success('AI suggestion added!');
      } else {
        toast.dismiss();
        toast.error('No AI suggestion found.');
      }
    } catch (err) {
      toast.dismiss();
      toast.error('AI error');
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Review & Edit Your Idea</h2>
      {fieldConfig.map(({ key, label, type, aiField }) => (
        <div key={key} className="border p-4 rounded-md dark:bg-gray-800 dark:text-white">
          <div className="flex justify-between items-center mb-2">
            <label className="font-semibold text-gray-700 dark:text-gray-200">{label}</label>
            <div className="flex gap-2">
              <button onClick={() => setEditing(key)} className="text-sm text-blue-600">✏️ Edit</button>
              <button onClick={() => handleAIFill(key, aiField)} className="text-sm text-purple-600">✨ AI Suggest</button>
            </div>
          </div>
          {editing === key ? (
            type === 'textarea' ? (
              <textarea
                className="w-full border rounded p-2 dark:bg-gray-700"
                value={localData[key] || ''}
                onChange={e => handleChange(key, e.target.value)}
                onBlur={() => setEditing(null)}
              />
            ) : (
              <input
                className="w-full border rounded p-2 dark:bg-gray-700"
                value={localData[key] || ''}
                onChange={e => handleChange(key, e.target.value)}
                onBlur={() => setEditing(null)}
              />
            )
          ) : (
            <p className="text-gray-600 dark:text-gray-300">{localData[key] || <em>Empty</em>}</p>
          )}
        </div>
      ))}

      <div className="flex justify-between pt-6">
        <button onClick={onBack} className="text-gray-600 dark:text-gray-300">Back</button>
        <button
          onClick={onSubmit}
          className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-6 py-2 rounded-full shadow"
        >
          Submit Idea
        </button>
      </div>
    </div>
  );
};

export default Step12_Review;
