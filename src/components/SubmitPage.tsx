import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';

const SubmitPage = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: '',
    problem: '',
    solution: '',
    status: 'Just an Idea',
    category: '',
    authorName: 'Anonymous',
    upvotes: 0,
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    try {
      await addDoc(collection(db, 'ideas'), form);
      navigate('/');
    } catch (err) {
      console.error('Error submitting idea:', err);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Submit Your Idea</h1>

      {step === 1 && (
        <>
          <label className="block mb-2">Idea Title</label>
          <input name="title" value={form.title} onChange={handleChange} className="w-full border p-2 mb-4 rounded" />

          <label className="block mb-2">What problem does it solve?</label>
          <textarea name="problem" value={form.problem} onChange={handleChange} className="w-full border p-2 mb-4 rounded" />

          <button onClick={handleNext} className="bg-blue-600 text-white px-4 py-2 rounded">Continue</button>
        </>
      )}

      {step === 2 && (
        <>
          <label className="block mb-2">How does it work?</label>
          <textarea name="solution" value={form.solution} onChange={handleChange} className="w-full border p-2 mb-4 rounded" />

          <label className="block mb-2">Status</label>
          <select name="status" value={form.status} onChange={handleChange} className="w-full border p-2 mb-4 rounded">
            <option>Just an Idea</option>
            <option>MVP in Progress</option>
            <option>Market Validated</option>
            <option>Launched</option>
          </select>

          <div className="flex justify-between">
            <button onClick={handleBack} className="text-gray-600">← Back</button>
            <button onClick={handleNext} className="bg-blue-600 text-white px-4 py-2 rounded">Continue</button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <label className="block mb-2">Category</label>
          <input name="category" value={form.category} onChange={handleChange} className="w-full border p-2 mb-4 rounded" />

          <label className="block mb-2">Your Name (optional)</label>
          <input name="authorName" value={form.authorName} onChange={handleChange} className="w-full border p-2 mb-4 rounded" />

          <div className="flex justify-between mt-4">
            <button onClick={handleBack} className="text-gray-600">← Back</button>
            <button onClick={handleSubmit} className="bg-primary text-white px-4 py-2 rounded">Submit Idea</button>
          </div>
        </>
      )}
    </div>
  );
};

export default SubmitPage;
