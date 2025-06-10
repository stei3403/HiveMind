import React from 'react';


type IdeaCardProps = {
  title: string;
  problem: string;
  solution: string;
  category?: string;
  status: string;
  upvotes: number;
  author: string;
  featureImage?: string;
};
;

const IdeaCard = ({ title, problem, solution, category, status, upvotes, author, featureImage }: IdeaCardProps) => {
  const cardClasses = `bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out p-5 flex flex-col gap-4 transform hover:scale-[1.03]`;
  const categoryClasses = `text-xs uppercase tracking-wide text-blue-600 dark:text-blue-400 font-semibold`;
  const titleClasses = `text-lg font-bold text-gray-900 dark:text-white leading-snug`;
  const descriptionClasses = `text-sm text-gray-600 dark:text-gray-300 line-clamp-2`;
  const footerContainerClasses = `flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mt-auto pt-2 border-t border-gray-100 dark:border-gray-700`;
  const upvotesClasses = `font-semibold text-blue-600 dark:text-blue-400`;
  const statusClasses = `px-2 py-0.5 rounded-full ml-2 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200`;
  const authorClasses = `font-semibold text-gray-700 dark:text-gray-200`;

return (
  <div className={cardClasses}>
    <img
      src={featureImage || '/No Image Available Placeholder.png'}
      alt="Feature"
      className="w-full h-48 object-cover rounded-md mb-2"
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = '/No Image Available Placeholder.png';
      }}
    />

    <span className={categoryClasses}>
      {category || "General"}
    </span>

    <h3 className={titleClasses}>{title}</h3>
    <p className={descriptionClasses}>
      <strong>Problem:</strong> {problem || "No problem provided."}
    </p>
    <p className={descriptionClasses}>
      <strong>Solution:</strong> {solution || "No solution provided."}
    </p>

      <div className={footerContainerClasses}>
        <div className="flex items-center gap-2">
          <span className={upvotesClasses}>{upvotes}</span> upvotes
          <span className={statusClasses}>{status}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className={authorClasses}>{author}</span>
        </div>
      </div>
    </div>
  );
};


export default IdeaCard;
