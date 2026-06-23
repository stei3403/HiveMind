import { IdeaStatus } from '../types/formTypes';

export const statusClasses: Record<IdeaStatus, string> = {
  'Just an Idea': 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700',
  'Researching': 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-900',
  'Currently Building': 'bg-yellow-100 text-yellow-900 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-200 dark:border-yellow-900',
  'Built and Launched': 'bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-200 dark:border-green-900',
  'Iterating and Improving': 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950 dark:text-purple-200 dark:border-purple-900',
};

export const statusChipClass = 'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold';

export const getStatusClass = (status?: string) =>
  statusClasses[(status || 'Just an Idea') as IdeaStatus] || statusClasses['Just an Idea'];
