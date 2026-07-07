import {
  ACTIVITY_LEVELS,
  GOALS,
  OnboardingErrors,
  OnboardingFormData,
} from '@/lib/onboarding';

type Props = {
  values: OnboardingFormData;
  errors: OnboardingErrors;
  onChange: (field: keyof OnboardingFormData, value: string) => void;
};

export default function FitnessProfileStep({ values, errors, onChange }: Props) {
  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-gray-900">Fitness profile</h2>

      <div>
        <label htmlFor="goal" className="block text-sm font-medium text-gray-700">
          Goal
        </label>
        <select
          id="goal"
          value={values.goal}
          onChange={(e) => onChange('goal', e.target.value)}
          className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.goal ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select goal</option>
          {GOALS.map((g) => (
            <option key={g} value={g}>
              {g.charAt(0).toUpperCase() + g.slice(1)} weight
            </option>
          ))}
        </select>
        {errors.goal && <p className="mt-1 text-sm text-red-600">{errors.goal}</p>}
      </div>

      <div>
        <label htmlFor="activity_level" className="block text-sm font-medium text-gray-700">
          Activity level
        </label>
        <select
          id="activity_level"
          value={values.activity_level}
          onChange={(e) => onChange('activity_level', e.target.value)}
          className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.activity_level ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select activity level</option>
          {ACTIVITY_LEVELS.map((level) => (
            <option key={level} value={level}>
              {level.charAt(0).toUpperCase() + level.slice(1).replace('-', ' ')}
            </option>
          ))}
        </select>
        {errors.activity_level && (
          <p className="mt-1 text-sm text-red-600">{errors.activity_level}</p>
        )}
      </div>

      <div>
        <label htmlFor="weight_kg" className="block text-sm font-medium text-gray-700">
          Current weight (kg)
        </label>
        <input
          id="weight_kg"
          type="number"
          min="0"
          step="0.1"
          value={values.weight_kg}
          onChange={(e) => onChange('weight_kg', e.target.value)}
          className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.weight_kg ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.weight_kg && (
          <p className="mt-1 text-sm text-red-600">{errors.weight_kg}</p>
        )}
      </div>

      <div>
        <label htmlFor="height_cm" className="block text-sm font-medium text-gray-700">
          Height (cm)
        </label>
        <input
          id="height_cm"
          type="number"
          min="0"
          step="1"
          value={values.height_cm}
          onChange={(e) => onChange('height_cm', e.target.value)}
          className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.height_cm ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.height_cm && (
          <p className="mt-1 text-sm text-red-600">{errors.height_cm}</p>
        )}
      </div>
    </div>
  );
}
