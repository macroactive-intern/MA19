type Props = {
  currentStep: 1 | 2 | 3;
};

export default function StepIndicator({ currentStep }: Props) {
  return (
    <div className="mb-6">
      <p className="text-sm font-medium text-gray-500">Step {currentStep} of 3</p>
      <div className="mt-2 flex gap-2">
        {([1, 2, 3] as const).map((step) => (
          <div
            key={step}
            className={`h-1.5 flex-1 rounded-full ${
              step <= currentStep ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
