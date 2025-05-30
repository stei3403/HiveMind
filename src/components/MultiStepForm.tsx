import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Step1_NameIdea from './steps/Step1_NameIdea';
import Step2_Problem from './steps/Step2_Problem';
import Step3_Solution from './steps/Step3_Solution';
import Step4_Status from './steps/Step4_Status';
import Step5_ProjectLinks from './steps/Step5_ProjectLinks';
import Step6_AIHelp from './steps/Step6_AIHelp';
import Step7_Industry from './steps/Step7_Industry';
import Step8_MarketSize from './steps/Step8_MarketSize';
import Step9_BusinessModel from './steps/Step9_BusinessModel';
import Step10_Team from './steps/Step10_Team';
import Step11_Tags from './steps/Step11_Tags';
import Step12_Review from './steps/Step12_Review';

const steps = [
  Step1_NameIdea,
  Step2_Problem,
  Step3_Solution,
  Step4_Status,
  Step5_ProjectLinks,
  Step6_AIHelp,
  Step7_Industry,
  //Step8_MarketSize,
  Step9_BusinessModel,
  Step10_Team,
  Step11_Tags,
  Step12_Review,
];

const MultiStepForm: React.FC = () => {
  const [stepIndex, setStepIndex] = useState(0);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        authorName: user.displayName || user.email || 'Anonymous',
      }));
    }
  }, [user]);

  const StepComponent = steps[stepIndex];

  const handleNext = (data: any) => {
    setFormData(prev => ({ ...prev, ...data }));
    setStepIndex(prev => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setStepIndex(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = () => {
    toast.success('🎉 Idea submitted!');
    setFormData({}); // clear data
    setStepIndex(0); // reset to first step
    navigate('/thanks'); // go to thank-you page
  };

  return (
    <div className="min-h-screen flex flex-col justify-between px-4 py-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md mx-auto w-full">
        <div className="flex justify-center space-x-1 mb-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full ${
                i === stepIndex ? 'bg-yellow-400' : 'bg-gray-300 dark:bg-gray-700'
              }`}
            ></div>
          ))}
        </div>

        <StepComponent
          data={formData}
          onNext={handleNext}
          onBack={handleBack}
          onSubmit={handleSubmit}
          isLastStep={stepIndex === steps.length - 1}
        />
      </div>
    </div>
  );
};

export default MultiStepForm;
