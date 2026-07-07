import { OnboardingErrors, OnboardingFormData, TIMEZONES } from '@/lib/onboarding';

type Props = {
  values: OnboardingFormData;
  errors: OnboardingErrors;
  onChange: (field: keyof OnboardingFormData, value: string) => void;
};

export default function PersonalDetailsStep({ values, errors, onChange }: Props) {
  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-gray-900">Personal details</h2>

      <div>
        <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
          First name
        </label>
        <input
          id="first_name"
          type="text"
          value={values.first_name}
          onChange={(e) => onChange('first_name', e.target.value)}
          className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.first_name ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.first_name && (
          <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>
        )}
      </div>

      <div>
        <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
          Last name
        </label>
        <input
          id="last_name"
          type="text"
          value={values.last_name}
          onChange={(e) => onChange('last_name', e.target.value)}
          className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.last_name ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.last_name && (
          <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>
        )}
      </div>

      <div>
        <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700">
          Date of birth
        </label>
        <input
          id="date_of_birth"
          type="date"
          value={values.date_of_birth}
          onChange={(e) => onChange('date_of_birth', e.target.value)}
          className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.date_of_birth ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.date_of_birth && (
          <p className="mt-1 text-sm text-red-600">{errors.date_of_birth}</p>
        )}
      </div>

      <div>
        <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
          Timezone
        </label>
        <select
          id="timezone"
          value={values.timezone}
          onChange={(e) => onChange('timezone', e.target.value)}
          className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.timezone ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select timezone</option>
          {TIMEZONES.map((tz) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </select>
        {errors.timezone && (
          <p className="mt-1 text-sm text-red-600">{errors.timezone}</p>
        )}
      </div>
    </div>
  );
}
