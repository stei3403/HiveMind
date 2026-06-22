export type IdeaStatus =
  | 'Just an Idea'
  | 'Researching'
  | 'Currently Building'
  | 'Built and Launched'
  | 'Iterating and Improving';

export interface IdeaFormData {
  title?: string;
  problem?: string;
  solution?: string;
  status?: IdeaStatus;
  links?: string;
  authorName?: string;
  industry?: string[];
  marketSize?: string;
  businessModel?: string;
  team?: string;
  targetAudience?: string;
  whyNow?: string;
  features?: string[];
  tags?: string[];
  images?: string[];
  featureImage?: string;
  aiHelpAccepted?: boolean;
}

export interface IdeaRecord extends IdeaFormData {
  id: string;
  upvotes?: number;
  createdAt?: unknown;
}

export interface StepProps {
  data: IdeaFormData;
  onNext: (data: Partial<IdeaFormData>) => void;
  onBack: () => void;
  onSubmit?: () => void;
  isLastStep?: boolean;
}
