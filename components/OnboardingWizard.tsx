'use client';

import { useEffect, useState } from 'react';
import {
  DEFAULT_FORM_DATA,
  DRAFT_STORAGE_KEY,
  type OnboardingDraft,
  type OnboardingErrors,
  type OnboardingFormData,
  validateStep,
} from '@/lib/onboarding';
import StepIndicator from './StepIndicator';
import PersonalDetailsStep from './PersonalDetailsStep';
import FitnessProfileStep from './FitnessProfileStep';
import DietaryPreferencesStep from './DietaryPreferencesStep';

export default function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState<OnboardingFormData>(DEFAULT_FORM_DATA);
  const [errors, setErrors] = useState<OnboardingErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [hasRestoredDraft, setHasRestoredDraft] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (raw) {
        const draft = JSON.parse(raw) as OnboardingDraft;
        if ([1, 2, 3].includes(draft.currentStep)) {
          setFormData({ ...DEFAULT_FORM_DATA, ...draft.formData });
          setCurrentStep(draft.currentStep);
        }
      }
    } catch {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    }
    setHasRestoredDraft(true);
  }, []);

  useEffect(() => {
    if (!hasRestoredDraft) return;
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify({ currentStep, formData }));
  }, [currentStep, formData, hasRestoredDraft]);

  function updateField(field: keyof OnboardingFormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function handleNext() {
    const stepErrors = validateStep(currentStep, formData);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    setCurrentStep((prev) => (prev < 3 ? ((prev + 1) as 1 | 2 | 3) : prev));
  }

  function handleBack() {
    setCurrentStep((prev) => (prev > 1 ? ((prev - 1) as 1 | 2 | 3) : prev));
  }

  async function handleFinish() {
    const stepErrors = validateStep(3, formData);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const payload = {
        ...formData,
        weight_kg: Number(formData.weight_kg),
        height_cm: Number(formData.height_cm),
      };

      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as { message?: string; error?: string };

      if (!res.ok) {
        setSubmitError(data.error ?? 'Something went wrong. Please try again.');
        return;
      }

      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setSuccessMessage(data.message ?? 'Onboarding complete!');
    } catch {
      setSubmitError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (successMessage) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-8 text-center">
        <p className="text-lg font-semibold text-green-800">{successMessage}</p>
        <p className="mt-2 text-sm text-green-600">Welcome to MacroActive.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
      <StepIndicator currentStep={currentStep} />

      {currentStep === 1 && (
        <PersonalDetailsStep values={formData} errors={errors} onChange={updateField} />
      )}
      {currentStep === 2 && (
        <FitnessProfileStep values={formData} errors={errors} onChange={updateField} />
      )}
      {currentStep === 3 && (
        <DietaryPreferencesStep values={formData} errors={errors} onChange={updateField} />
      )}

      {submitError && (
        <p className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{submitError}</p>
      )}

      <div className="mt-8 flex justify-between">
        <div>
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Back
            </button>
          )}
        </div>

        <div>
          {currentStep < 3 && (
            <button
              type="button"
              onClick={handleNext}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Next
            </button>
          )}
          {currentStep === 3 && (
            <button
              type="button"
              onClick={handleFinish}
              disabled={isSubmitting}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting…' : 'Finish'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
