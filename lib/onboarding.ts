export type OnboardingFormData = {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  timezone: string;
  goal: 'lose' | 'maintain' | 'gain' | '';
  activity_level: string;
  weight_kg: string;
  height_cm: string;
  macro_split: 'high-protein' | 'balanced' | 'low-carb' | '';
  dietary_restrictions: string;
};

export type OnboardingErrors = Partial<Record<keyof OnboardingFormData, string>>;

export type OnboardingDraft = {
  currentStep: 1 | 2 | 3;
  formData: OnboardingFormData;
};

export const DEFAULT_FORM_DATA: OnboardingFormData = {
  first_name: '',
  last_name: '',
  date_of_birth: '',
  timezone: '',
  goal: '',
  activity_level: '',
  weight_kg: '',
  height_cm: '',
  macro_split: '',
  dietary_restrictions: '',
};

export const DRAFT_STORAGE_KEY = 'macroactive-onboarding-draft';

export const TIMEZONES = [
  'Pacific/Auckland',
  'Australia/Sydney',
  'Europe/London',
  'America/New_York',
  'America/Los_Angeles',
] as const;

export const GOALS = ['lose', 'maintain', 'gain'] as const;

export const ACTIVITY_LEVELS = [
  'sedentary',
  'light',
  'moderate',
  'active',
  'very-active',
] as const;

export const MACRO_SPLITS = ['high-protein', 'balanced', 'low-carb'] as const;

export function validateStep(
  step: 1 | 2 | 3,
  formData: OnboardingFormData,
): OnboardingErrors {
  const errors: OnboardingErrors = {};

  if (step === 1) {
    if (!formData.first_name.trim()) errors.first_name = 'First name is required';
    if (!formData.last_name.trim()) errors.last_name = 'Last name is required';
    if (!formData.date_of_birth) errors.date_of_birth = 'Date of birth is required';
    if (!formData.timezone) errors.timezone = 'Timezone is required';
  }

  if (step === 2) {
    if (!formData.goal) errors.goal = 'Goal is required';
    if (!formData.activity_level) errors.activity_level = 'Activity level is required';

    if (!formData.weight_kg) {
      errors.weight_kg = 'Weight is required';
    } else {
      const w = Number(formData.weight_kg);
      if (!Number.isFinite(w) || w <= 0) errors.weight_kg = 'Weight must be a positive number';
    }

    if (!formData.height_cm) {
      errors.height_cm = 'Height is required';
    } else {
      const h = Number(formData.height_cm);
      if (!Number.isFinite(h) || h <= 0) errors.height_cm = 'Height must be a positive number';
    }
  }

  if (step === 3) {
    if (!formData.macro_split) errors.macro_split = 'Macro split is required';
  }

  return errors;
}
