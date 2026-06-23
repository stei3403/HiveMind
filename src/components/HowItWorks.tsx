import React from 'react';

const HowItWorks = () => {
  const steps = [
    {
      title: 'Share Your Idea',
      desc: 'Submit unused ideas, half-formed concepts, or ambitious projects that need clearer shape.',
    },
    {
      title: 'Find Collaborators',
      desc: 'Help builders, designers, and subject-matter experts discover ideas that fit their interests.',
    },
    {
      title: 'Build Together',
      desc: 'Turn promising concepts into research, prototypes, partnerships, or launched projects.',
    },
  ];

  return (
    <section className="bg-white dark:bg-gray-900 py-16 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-12 text-gray-900 dark:text-white">How HiveMind Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {steps.map((step, index) => (
            <div key={step.title} className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-400 text-lg font-bold text-gray-900">
                {index + 1}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{step.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 max-w-xs">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
