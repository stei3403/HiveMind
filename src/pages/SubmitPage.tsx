import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';
import IdeaForm from '../components/IdeaForm';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { IdeaFormData } from '../types/formTypes';

const SubmitPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (data: IdeaFormData) => {
    if (!user) {
      toast.error('Please log in to submit your idea.');
      return;
    }

    setSaving(true);

    try {
      await addDoc(collection(db, 'ideas'), {
        ...data,
        authorName: user.displayName || user.email || 'Anonymous',
        authorUid: user.uid,
        status: data.status || 'Just an Idea',
        upvotes: 0,
        createdAt: serverTimestamp(),
      });

      toast.success('Idea submitted.');
      navigate('/thanks');
    } catch (error) {
      console.error('Error submitting idea:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <IdeaForm
        heading="Submit an Idea"
        subheading="Capture the useful shape of the idea in one pass. You can come back and refine it later."
        submitLabel="Submit Idea"
        savingLabel="Submitting..."
        saving={saving}
        onCancel={() => navigate('/browse')}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default SubmitPage;
