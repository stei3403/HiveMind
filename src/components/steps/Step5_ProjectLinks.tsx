import React, { useState } from 'react';

interface StepProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  isLastStep?: boolean;
  onSubmit?: () => void;
}

interface LinkItem {
  type: string;
  url: string;
}

const links: React.FC<StepProps> = ({ data, onNext, onBack }) => {
  const [links, setLinks] = useState<LinkItem[]>(data.links || []);

  const handleAddLink = (type: string) => {
    const url = prompt(`Paste your ${type} link:`);
    if (url) {
      setLinks(prev => [...prev, { type, url }]);
    }
  };

  const handleAddCustomLink = () => {
    const url = prompt('Paste your custom link:');
    if (url) {
      setLinks(prev => [...prev, { type: 'Other', url }]);
    }
  };

  const handleContinue = () => {
    onNext({ links: links });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <button onClick={onBack} className="text-gray-600 dark:text-gray-300 text-2xl">←</button>
        <button onClick={() => onNext({ links: [] })} className="text-yellow-500 font-semibold">Skip</button>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Add project links</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">🧑‍💻 Share your work or documentation</p>

      <div className="space-y-3">
        <button
          onClick={() => handleAddLink('GitHub')}
          className="w-full flex items-center justify-between px-4 py-3 bg-yellow-50 rounded shadow-sm border"
        >
          <span>🐙 GitHub</span>
          <span className="text-sm text-gray-400">Repository or project</span>
        </button>

        <button
          onClick={() => handleAddLink('Google Docs')}
          className="w-full flex items-center justify-between px-4 py-3 bg-yellow-50 rounded shadow-sm border"
        >
          <span>📄 Google Docs</span>
          <span className="text-sm text-gray-400">Documentation or specs</span>
        </button>

        <button
          onClick={() => handleAddLink('Figma')}
          className="w-full flex items-center justify-between px-4 py-3 bg-yellow-50 rounded shadow-sm border"
        >
          <span>🎨 Figma</span>
          <span className="text-sm text-gray-400">Design files or prototypes</span>
        </button>

        <button
          onClick={handleAddCustomLink}
          className="w-full border-2 border-dashed border-yellow-400 text-yellow-500 py-3 rounded hover:bg-yellow-50"
        >
          + Add other link
        </button>
      </div>

      {links.length > 0 && (
        <div className="pt-4 space-y-2">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Attached Links:</h3>
          <ul className="text-sm text-gray-700 dark:text-gray-200 space-y-1">
            {links.map((link, index) => (
              <li key={index}>🔗 <strong>{link.type}:</strong> <a href={link.url} target="_blank" rel="noreferrer" className="underline">{link.url}</a></li>
            ))}
          </ul>
        </div>
      )}

      <div className="pt-6">
        <button
          onClick={handleContinue}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-3 rounded-full"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default links;
