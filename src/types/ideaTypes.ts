// src/types/ideaTypes.ts

export type Idea = {
  id: string;
  title: string;
  problem: string;
  solution: string;
  category: string;
  status: string;
  upvotes: number;
  authorName: string;
  authorId: string;
  featureImage?: string;
  marketSize?: string;
  businessModel?: string;
  team?: string;
  tags?: string[];
  images?: string[];
};
