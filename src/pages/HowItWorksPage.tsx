import React from 'react';
import { Link } from 'react-router-dom';

const lifecycleSteps = [
  {
    eyebrow: 'Step 1',
    title: 'Share The Spark',
    text: 'Start with the raw opportunity: the problem, who feels it, why it matters, and the first version of a possible solution.',
  },
  {
    eyebrow: 'Step 2',
    title: 'Shape A Brief',
    text: 'Turn the idea into something other people can evaluate with audience, revenue model, links, tags, status, and supporting detail.',
  },
  {
    eyebrow: 'Step 3',
    title: 'Gather Signals',
    text: 'Community votes, tags, browsing, and admin curation help promising ideas surface without needing a meeting or pitch deck.',
  },
  {
    eyebrow: 'Step 4',
    title: 'Create Momentum',
    text: 'Ideas can attract collaborators, inspire prototypes, become research projects, or simply help someone else avoid starting from zero.',
  },
];

const communityPillars = [
  {
    title: 'Open Starting Points',
    text: 'An idea page gives builders enough context to understand the opportunity, spot missing pieces, and decide whether to dig deeper.',
  },
  {
    title: 'Collective Filtering',
    text: 'Scores, statuses, and tags make the database easier to scan as it grows, so the most useful ideas do not get buried.',
  },
  {
    title: 'Shared Ownership Of Progress',
    text: 'The original submitter can keep refining the brief, while the community can react, explore, and build from it.',
  },
];

const useCases = [
  'Submit ideas you may not personally build.',
  'Browse concepts by category, status, and score.',
  'Save links, images, and research alongside each brief.',
  'Use votes and admin curation to shape what rises to the top.',
  'Turn a rough thought into a collaboration-ready starting point.',
];

const HowItWorksPage: React.FC = () => (
  <main className="bg-white text-gray-800 dark:bg-gray-900 dark:text-white">
    <section className="border-b border-gray-200 bg-yellow-50 dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-yellow-700 dark:text-yellow-300">
            How HiveMind Works
          </p>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            A shared workspace for ideas that deserve a second life.
          </h1>
          <p className="mt-5 text-lg leading-8 text-gray-700 dark:text-gray-300">
            HiveMind is more than a personal idea database. It is a place to turn unfinished concepts into useful public briefs, then let the community help them become easier to find, evaluate, improve, and build.
          </p>
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-6xl px-4 py-14">
      <div className="mb-8 max-w-2xl">
        <h2 className="text-3xl font-bold">The Idea Lifecycle</h2>
        <p className="mt-3 text-gray-600 dark:text-gray-300">
          Every idea starts messy. The app gives it just enough structure to become searchable, discussable, and actionable.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {lifecycleSteps.map((step) => (
          <section
            key={step.title}
            className="rounded-md border border-gray-200 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="mb-4 text-sm font-semibold text-yellow-700 dark:text-yellow-300">{step.eyebrow}</div>
            <h3 className="text-xl font-semibold">{step.title}</h3>
            <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">{step.text}</p>
          </section>
        ))}
      </div>
    </section>

    <section className="border-y border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <h2 className="text-3xl font-bold">Built Around Community Signals</h2>
          <p className="mt-4 leading-7 text-gray-600 dark:text-gray-300">
            Most idea tools are private notebooks. HiveMind works better when ideas are visible enough for other people to react, improve, challenge, and eventually carry forward.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {communityPillars.map((pillar) => (
            <section
              key={pillar.title}
              className="rounded-md border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800"
            >
              <h3 className="font-semibold">{pillar.title}</h3>
              <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">{pillar.text}</p>
            </section>
          ))}
        </div>
      </div>
    </section>

    <section className="mx-auto grid max-w-6xl gap-8 px-4 py-14 md:grid-cols-[1fr_1fr] md:items-center">
      <div>
        <h2 className="text-3xl font-bold">What You Can Do Here</h2>
        <p className="mt-3 leading-7 text-gray-600 dark:text-gray-300">
          The best version of HiveMind is a living catalog: part notebook, part discovery engine, part lightweight collaboration layer.
        </p>
      </div>

      <div className="rounded-md border border-yellow-200 bg-yellow-50 p-6 dark:border-yellow-700/60 dark:bg-yellow-900/20">
        <ul className="space-y-3">
          {useCases.map((useCase) => (
            <li key={useCase} className="flex gap-3 text-gray-700 dark:text-gray-200">
              <span className="mt-2 h-2 w-2 flex-none rounded-full bg-yellow-500" aria-hidden="true" />
              <span>{useCase}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>

    <section className="border-t border-gray-200 dark:border-gray-800">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-12 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Ready to add to the database?</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Submit a fresh idea or browse what is already waiting for the right person.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            to="/submit"
            className="inline-flex justify-center rounded-md bg-yellow-400 px-5 py-3 font-semibold text-gray-900 hover:bg-yellow-500"
          >
            Submit Idea
          </Link>
          <Link
            to="/browse"
            className="inline-flex justify-center rounded-md border border-gray-300 px-5 py-3 font-semibold hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            Browse Ideas
          </Link>
        </div>
      </div>
    </section>
  </main>
);

export default HowItWorksPage;
