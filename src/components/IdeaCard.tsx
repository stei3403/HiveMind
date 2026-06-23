import React from 'react';

type IdeaCardProps = {
  title: string;
  problem: string;
  solution: string;
  category?: string;
  status: string;
  score: number;
  upvotes: number;
  downvotes?: number;
  author: string;
  featureImage?: string;
};

const IdeaCard = ({
  title,
  problem,
  solution,
  category,
  status,
  score,
  upvotes,
  downvotes = 0,
  author,
  featureImage,
}: IdeaCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-md hover:shadow-lg transition-all duration-300 ease-in-out p-5 flex flex-col gap-4 transform hover:scale-[1.02]">
      <img
        src={featureImage || '/No Image Available Placeholder.png'}
        alt=""
        className="w-full h-48 object-cover rounded-md mb-2"
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = '/No Image Available Placeholder.png';
        }}
      />

      <span className="text-xs uppercase tracking-wide text-blue-600 dark:text-blue-400 font-semibold">
        {category || 'General'}
      </span>

      <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-snug">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
        <strong>Problem:</strong> {problem || 'No problem provided.'}
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
        <strong>Solution:</strong> {solution || 'No solution provided.'}
      </p>

      <div className="flex flex-col gap-2 text-xs text-gray-500 dark:text-gray-400 mt-auto pt-2 border-t border-gray-100 dark:border-gray-700">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-blue-600 dark:text-blue-400">{score}</span>
          <span>score</span>
          <span className="text-gray-400">/</span>
          <span>{upvotes} up</span>
          <span>{downvotes} down</span>
          <span className="px-2 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
            {status}
          </span>
        </div>
        <div className="font-semibold text-gray-700 dark:text-gray-200">{author}</div>
      </div>
    </div>
  );
};

export default IdeaCard;
