import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import IdeaForm from '../components/IdeaForm';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { IdeaFormData, IdeaRecord } from '../types/formTypes';

const IdeaEditPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [idea, setIdea] = useState<IdeaRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const canEdit = useMemo(
    () => !!user && !!idea && (isAdmin || idea.authorUid === user.uid),
    [idea, isAdmin, user]
  );

  useEffect(() => {
    const fetchIdea = async () => {
      if (!id) return;

      try {
        const docSnap = await getDoc(doc(db, 'ideas', id));
        if (docSnap.exists()) {
          setIdea({ id: docSnap.id, ...docSnap.data() } as IdeaRecord);
        }
      } catch (error) {
        console.error('Error loading idea:', error);
        toast.error('Unable to load idea.');
      } finally {
        setLoading(false);
      }
    };

    fetchIdea();
  }, [id]);

  const handleSave = async (data: IdeaFormData) => {
    if (!id || !idea || !canEdit) return;

    setSaving(true);

    try {
      const upvotes = idea.upvotes || 0;
      const downvotes = idea.downvotes || 0;
      const adminScoreAdjustment = isAdmin ? data.adminScoreAdjustment || 0 : idea.adminScoreAdjustment || 0;
      const nextScore = upvotes - downvotes + adminScoreAdjustment;

      await updateDoc(doc(db, 'ideas', id), {
        title: data.title || '',
        problem: data.problem || '',
        solution: data.solution || '',
        status: data.status || 'Just an Idea',
        links: data.links || '',
        authorName: idea.authorName || user?.displayName || user?.email || 'Anonymous',
        industry: data.industry || [],
        marketSize: data.marketSize || '',
        businessModel: data.businessModel || '',
        team: data.team || '',
        targetAudience: data.targetAudience || '',
        whyNow: data.whyNow || '',
        features: data.features || [],
        tags: data.tags || [],
        images: data.images || [],
        featureImage: data.featureImage || '',
        upvotes,
        downvotes,
        adminScoreAdjustment,
        score: nextScore,
        updatedAt: serverTimestamp(),
      });

      toast.success('Idea updated.');
      navigate(`/idea/${id}`);
    } catch (error) {
      console.error('Error updating idea:', error);
      toast.error('Unable to update idea.');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return <div className="p-6 text-center text-gray-600 dark:text-gray-300">Loading...</div>;
  }

  if (!idea) {
    return <div className="p-6 text-center text-red-600">Idea not found.</div>;
  }

  if (!canEdit) {
    return <div className="p-6 text-center text-red-600">You do not have permission to edit this idea.</div>;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <IdeaForm
        initialData={idea}
        heading="Edit Idea"
        subheading={isAdmin ? 'Admin editing is enabled for this idea.' : 'Update the idea brief and media.'}
        submitLabel="Save Changes"
        savingLabel="Saving..."
        saving={saving}
        showAdminControls={isAdmin}
        onCancel={() => navigate(`/idea/${id}`)}
        onSubmit={handleSave}
      />
    </div>
  );
};

export default IdeaEditPage;
