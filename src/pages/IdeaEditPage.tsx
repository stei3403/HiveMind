import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { IdeaRecord, IdeaStatus } from '../types/formTypes';

const statusOptions: IdeaStatus[] = [
  'Just an Idea',
  'Researching',
  'Currently Building',
  'Built and Launched',
  'Iterating and Improving',
];

const listToText = (items?: string[]) => (items || []).join('\n');

const textToList = (value: string) =>
  value
    .split(/\r?\n|,/)
    .map(item => item.trim())
    .filter(Boolean);

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

  const updateField = (field: keyof IdeaRecord, value: string | string[]) => {
    setIdea(prev => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!id || !idea || !canEdit) return;

    if (!idea.title || !idea.problem || !idea.solution || !idea.status) {
      toast.error('Title, problem, solution, and status are required.');
      return;
    }

    setSaving(true);
    try {
      await updateDoc(doc(db, 'ideas', id), {
        title: idea.title,
        problem: idea.problem,
        solution: idea.solution,
        status: idea.status,
        links: idea.links || '',
        authorName: idea.authorName || user?.displayName || user?.email || 'Anonymous',
        industry: idea.industry || [],
        marketSize: idea.marketSize || '',
        businessModel: idea.businessModel || '',
        team: idea.team || '',
        targetAudience: idea.targetAudience || '',
        whyNow: idea.whyNow || '',
        features: idea.features || [],
        tags: idea.tags || [],
        images: idea.images || [],
        featureImage: idea.featureImage || '',
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
    <div className="max-w-3xl mx-auto px-4 py-8 text-gray-800 dark:text-white">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Edit Idea</h1>
        {isAdmin && (
          <span className="text-xs uppercase tracking-wide text-blue-600 dark:text-blue-300">
            Admin
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        <label className="block">
          <span className="block text-sm font-semibold mb-1">Title</span>
          <input
            value={idea.title || ''}
            onChange={event => updateField('title', event.target.value)}
            className="w-full border rounded-md px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
          />
        </label>

        <label className="block">
          <span className="block text-sm font-semibold mb-1">Status</span>
          <select
            value={idea.status || 'Just an Idea'}
            onChange={event => updateField('status', event.target.value as IdeaStatus)}
            className="w-full border rounded-md px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="block text-sm font-semibold mb-1">Problem</span>
          <textarea
            value={idea.problem || ''}
            onChange={event => updateField('problem', event.target.value)}
            rows={5}
            className="w-full border rounded-md px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
          />
        </label>

        <label className="block">
          <span className="block text-sm font-semibold mb-1">Solution</span>
          <textarea
            value={idea.solution || ''}
            onChange={event => updateField('solution', event.target.value)}
            rows={5}
            className="w-full border rounded-md px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
          />
        </label>

        <label className="block">
          <span className="block text-sm font-semibold mb-1">Target Audience</span>
          <textarea
            value={idea.targetAudience || ''}
            onChange={event => updateField('targetAudience', event.target.value)}
            rows={3}
            className="w-full border rounded-md px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
          />
        </label>

        <label className="block">
          <span className="block text-sm font-semibold mb-1">Why Now</span>
          <textarea
            value={idea.whyNow || ''}
            onChange={event => updateField('whyNow', event.target.value)}
            rows={3}
            className="w-full border rounded-md px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
          />
        </label>

        <label className="block">
          <span className="block text-sm font-semibold mb-1">Business Model</span>
          <textarea
            value={idea.businessModel || ''}
            onChange={event => updateField('businessModel', event.target.value)}
            rows={5}
            className="w-full border rounded-md px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
          />
        </label>

        <label className="block">
          <span className="block text-sm font-semibold mb-1">Team</span>
          <textarea
            value={idea.team || ''}
            onChange={event => updateField('team', event.target.value)}
            rows={3}
            className="w-full border rounded-md px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
          />
        </label>

        <label className="block">
          <span className="block text-sm font-semibold mb-1">Links</span>
          <input
            value={idea.links || ''}
            onChange={event => updateField('links', event.target.value)}
            className="w-full border rounded-md px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
          />
        </label>

        <label className="block">
          <span className="block text-sm font-semibold mb-1">Feature Image URL</span>
          <input
            value={idea.featureImage || ''}
            onChange={event => updateField('featureImage', event.target.value)}
            className="w-full border rounded-md px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
          />
        </label>

        <label className="block">
          <span className="block text-sm font-semibold mb-1">Industries</span>
          <textarea
            value={listToText(idea.industry)}
            onChange={event => updateField('industry', textToList(event.target.value))}
            rows={4}
            className="w-full border rounded-md px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
          />
        </label>

        <label className="block">
          <span className="block text-sm font-semibold mb-1">Features</span>
          <textarea
            value={listToText(idea.features)}
            onChange={event => updateField('features', textToList(event.target.value))}
            rows={5}
            className="w-full border rounded-md px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
          />
        </label>

        <label className="block">
          <span className="block text-sm font-semibold mb-1">Tags</span>
          <textarea
            value={listToText(idea.tags)}
            onChange={event => updateField('tags', textToList(event.target.value))}
            rows={4}
            className="w-full border rounded-md px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
          />
        </label>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate(`/idea/${id}`)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded-md disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default IdeaEditPage;
