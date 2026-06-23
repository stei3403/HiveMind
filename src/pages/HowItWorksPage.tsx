import React from 'react';
import { Link } from 'react-router-dom';

const steps = [
  {
    title: 'Capture',
    text: 'Write the problem, solution, audience, business model, and supporting details in a single idea brief.',
  },
  {
    title: 'Refine',
    text: 'Edit the idea over time as the concept becomes clearer, better researched, or more actionable.',
  },
  {
    title: 'Discover',
    text: 'Browse the database by status, topic, and keywords to find ideas worth building or improving.',
  },
  {
    title: 'Build',
    text: 'Use each idea page as a shared starting point for validation, collaboration, and execution.',
  },
];

const HowItWorksPage: React.FC = () => (
  <main className="max-w-5xl mx-auto px-4 py-12 text-gray-800 dark:text-white">
    <div className="mb-10 max-w-3xl">
      <h1 className="text-4xl font-bold">How HiveMind Works</h1>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
        HiveMind is an idea database for turning loose concepts into clear, reusable briefs.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {steps.map((step, index) => (
        <section key={step.title} className="rounded-md border border-gray-200 dark:border-gray-700 p-6">
          <div className="mb-3 text-sm font-semibold text-yellow-600 dark:text-yellow-300">
            Step {index + 1}
          </div>
          <h2 className="text-xl font-semibold">{step.title}</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">{step.text}</p>
        </section>
      ))}
    </div>

    <div className="mt-10 flex flex-col sm:flex-row gap-3">
      <Link
        to="/submit"
        className="inline-flex justify-center rounded-md bg-yellow-400 px-5 py-3 font-semibold text-white hover:bg-yellow-500"
      >
        Submit Idea
      </Link>
      <Link
        to="/browse"
        className="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-700 px-5 py-3 font-semibold"
      >
        Browse Ideas
      </Link>
    </div>
  </main>
);

export default HowItWorksPage;
