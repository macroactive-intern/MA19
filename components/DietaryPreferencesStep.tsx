import { MACRO_SPLITS, OnboardingErrors, OnboardingFormData } from '@/lib/onboarding';

type Props = {
  values: OnboardingFormData;
  errors: OnboardingErrors;
  onChange: (field: keyof OnboardingFormData, value: string) => void;
};

export default function DietaryPreferencesStep({ values, errors, onChange }: Props) {
  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-gray-900">Dietary preferences</h2>

      <div>
        <label htmlFor="macro_split" className="block text-sm font-medium text-gray-700">
          Preferred macro split
        </label>
        <select
          id="macro_split"
          value={values.macro_split}
          onChange={(e) => onChange('macro_split', e.target.value)}
          className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.macro_split ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select macro split</option>
          {MACRO_SPLITS.map((split) => (
            <option key={split} value={split}>
              {split
                .split('-')
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(' ')}
            </option>
          ))}
        </select>
        {errors.macro_split && (
          <p className="mt-1 text-sm text-red-600">{errors.macro_split}</p>
        )}
      </div>

      <div>
        <label htmlFor="dietary_restrictions" className="block text-sm font-medium text-gray-700">
          Dietary restrictions{' '}
          <span className="font-normal text-gray-400">(optional)</span>
        </label>
        <textarea
          id="dietary_restrictions"
          rows={3}
          value={values.dietary_restrictions}
          onChange={(e) => onChange('dietary_restrictions', e.target.value)}
          placeholder="e.g. vegetarian, gluten-free, nut allergy..."
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}
