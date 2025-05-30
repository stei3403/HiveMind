import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase';

interface StepProps {
  data: any;
  onBack: () => void;
  onSubmit?: () => void;
  isLastStep?: boolean;
}

const Step12_Review: React.FC<StepProps> = ({ data, onBack, onSubmit, isLastStep }) => {
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleContinue = async () => {
    if (!isLastStep || !onSubmit) return;

    setSubmitting(true);
    try {
      const payload = {
        title: data.Step1_NameIdea,
        problem: data.Step2_Problem,
        solution: data.Step3_Solution,
        status: data.Step4_Status,
        links: data.Step5_ProjectLinks,
        industry: data.Step7_Industry,
        //marketSize: data.Step8_MarketSize,
        businessModel: data.Step9_BusinessModel,
        team: data.Step10_Team,
        tags: data.Step11_Tags,
        aiHelp: data.Step6_AIHelp,
        note,
        upvotes: 0,
        authorName: data.authorName || 'Anonymous',
        createdAt: new Date(),
      };

      await addDoc(collection(db, 'ideas'), payload);
      onSubmit();
    } catch (err) {
      console.error('Error submitting idea:', err);
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">🎉 All Done!</h2>
      <p className="text-gray-600 dark:text-gray-300">Your idea is ready to be shared with the HiveMind community.</p>
      <textarea
        className="w-full p-4 border rounded-md dark:bg-gray-800 dark:text-white"
        rows={4}
        placeholder="Ready to publish? Add a final note (optional)..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <div className="flex justify-between">
        <button onClick={onBack} className="text-gray-600 dark:text-gray-300">Back</button>
        <button
          onClick={handleContinue}
          disabled={submitting}
          className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-6 py-2 rounded-full shadow"
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </div>
  );
};

export default Step12_Review;
