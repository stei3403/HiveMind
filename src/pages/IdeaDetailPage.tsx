
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const IdeaDetailPage: React.FC = () => {
  const { id } = useParams();
  const [idea, setIdea] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIdea = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'ideas', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setIdea(docSnap.data());
        } else {
          console.error('Idea not found');
        }
      } catch (err) {
        console.error('Error fetching idea:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchIdea();
  }, [id]);

  if (loading) return <div className="text-center p-6">Loading...</div>;
  if (!idea) return <div className="text-center p-6 text-red-600">Idea not found.</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 text-gray-800 dark:text-white">
      <img
        src={idea.featureImage || '/No Image Available Placeholder.png'}
        alt="Feature"
        className="w-full h-64 object-cover rounded-lg mb-6"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = '/No Image Available Placeholder.png';
        }}
      />

      <h1 className="text-3xl font-bold mb-2">{idea.title}</h1>
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">{idea.status}</div>

      <div className="mb-4">
        <p><strong>Problem:</strong></p>
        <p>{idea.problem}</p>
      </div>

      <div className="mb-4">
        <p><strong>Solution:</strong></p>
        <p>{idea.solution}</p>
      </div>

      {idea.industry?.length > 0 && (
        <div className="mb-4">
          <p><strong>Industry:</strong> {idea.industry.join(', ')}</p>
        </div>
      )}

      {idea.tags?.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Tags: {Array.isArray(idea.tags) ? idea.tags.join(", ") : "None"}
          </p>
        </div>
      )}

      {idea.team && (
        <div className="mb-4">
          <p><strong>Team:</strong></p>
          <p>{idea.team}</p>
        </div>
      )}

      {idea.businessModel && (
        <div className="mb-4">
          <p><strong>Business Model:</strong></p>
          <p>{idea.businessModel}</p>
        </div>
      )}

      {idea.images?.length > 1 && (
        <div className="mb-4">
          <p className="font-semibold mb-2">Gallery:</p>
          <div className="grid grid-cols-3 gap-4">
            {idea.images.slice(1).map((url: string, idx: number) => (
              <img
                key={idx}
                src={url}
                alt={`Image ${idx + 2}`}
                className="w-full h-24 object-cover rounded-md"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/A_placeholder_digital_graphic_design_features_a_me.png';
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );

};

export default IdeaDetailPage;
