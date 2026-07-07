import OnboardingWizard from '@/components/OnboardingWizard';

export default function Home() {
  return (
    <main className="flex min-h-full flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-lg">
        <h1 className="mb-8 text-2xl font-bold text-gray-900">MacroActive — Onboarding</h1>
        <OnboardingWizard />
      </div>
    </main>
  );
}
