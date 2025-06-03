export interface IdeaFormData {
  name?: string;
  problem?: string;
  solution?: string;
  status?: string;
  links?: string;
  authorName?: string;
  industry?: string[];
  businessModel?: string;
  targetAudience?: string;
  whyNow?: string;
  features?: string[];
  tags?: string[];
}

export interface StepProps {
  data: IdeaFormData;
  onNext: (data: Partial<IdeaFormData>) => void;
  onBack: () => void;
  onSubmit?: () => void;
  isLastStep?: boolean;
}
