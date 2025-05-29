import React from 'react';

type IdeaCardProps = {
  title: string;
  description: string;
  category: string;
  status: string;
  upvotes: number;
  author: string;
};

const IdeaCard = ({ title, description, category, status, upvotes, author }: IdeaCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition p-5 flex flex-col gap-4">
      <span className="text-xs uppercase tracking-wide text-blue-600 dark:text-blue-400 font-semibold">
        {category}
      </span>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-snug">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{description}</p>
      <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mt-auto pt-2 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-blue-600 dark:text-blue-400">{upvotes}</span> upvotes
          <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-0.5 rounded-full ml-2">
            {status}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-semibold">{author}</span>
        </div>
      </div>
    </div>
  );
};

export default IdeaCard;
