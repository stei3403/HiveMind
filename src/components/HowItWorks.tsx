import React from 'react';

const HowItWorks = () => {
  const steps = [
    {
      title: 'Share Your Idea',
      desc: 'Submit your unused ideas, half-baked concepts, or ambitious projects that need a team.',
      icon: '📝',
    },
    {
      title: 'Find Collaborators',
      desc: 'Connect with developers, designers, and experts who are excited about your vision.',
      icon: '🔗',
    },
    {
      title: 'Build Together',
      desc: 'Transform ideas into reality with community support, feedback, and shared resources.',
      icon: '🚀',
    },
  ];

  return (
    <section className="bg-white dark:bg-gray-900 py-16 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-12 text-gray-900 dark:text-white">How HiveMind Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center gap-4 text-center">
              <div className="text-4xl">{step.icon}</div>
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
