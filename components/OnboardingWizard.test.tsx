import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OnboardingWizard from '@/components/OnboardingWizard';

beforeEach(() => {
  localStorage.clear();
});

describe('OnboardingWizard', () => {
  it('Next does not advance if required fields are empty', async () => {
    const user = userEvent.setup();
    render(<OnboardingWizard />);

    expect(screen.getByText('Step 1 of 3')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Next' }));

    expect(screen.getByText('Step 1 of 3')).toBeInTheDocument();
    expect(screen.getByText('First name is required')).toBeInTheDocument();
    expect(screen.getByText('Last name is required')).toBeInTheDocument();
    expect(screen.getByText('Date of birth is required')).toBeInTheDocument();
    expect(screen.getByText('Timezone is required')).toBeInTheDocument();
  });

  it('Back preserves Step 2 data', async () => {
    const user = userEvent.setup();
    render(<OnboardingWizard />);

    // Fill Step 1
    await user.type(screen.getByLabelText('First name'), 'Alice');
    await user.type(screen.getByLabelText('Last name'), 'Smith');
    fireEvent.change(screen.getByLabelText('Date of birth'), {
      target: { value: '1995-04-12' },
    });
    await user.selectOptions(screen.getByLabelText('Timezone'), 'Pacific/Auckland');

    // Advance to Step 2
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByText('Step 2 of 3')).toBeInTheDocument();

    // Fill Step 2
    await user.selectOptions(screen.getByLabelText('Goal'), 'lose');
    await user.selectOptions(screen.getByLabelText('Activity level'), 'moderate');
    await user.type(screen.getByLabelText('Current weight (kg)'), '72');
    await user.type(screen.getByLabelText('Height (cm)'), '165');

    // Go back to Step 1
    await user.click(screen.getByRole('button', { name: 'Back' }));
    expect(screen.getByText('Step 1 of 3')).toBeInTheDocument();

    // Return to Step 2
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByText('Step 2 of 3')).toBeInTheDocument();

    // Step 2 values are preserved
    expect(screen.getByLabelText<HTMLSelectElement>('Goal')).toHaveValue('lose');
    expect(screen.getByLabelText<HTMLSelectElement>('Activity level')).toHaveValue('moderate');
    expect(screen.getByLabelText<HTMLInputElement>('Current weight (kg)')).toHaveValue(72);
    expect(screen.getByLabelText<HTMLInputElement>('Height (cm)')).toHaveValue(165);
  });

  it('Wizard state saves to localStorage on step change', async () => {
    const user = userEvent.setup();
    render(<OnboardingWizard />);

    // Fill Step 1
    await user.type(screen.getByLabelText('First name'), 'Alice');
    await user.type(screen.getByLabelText('Last name'), 'Smith');
    fireEvent.change(screen.getByLabelText('Date of birth'), {
      target: { value: '1995-04-12' },
    });
    await user.selectOptions(screen.getByLabelText('Timezone'), 'Pacific/Auckland');

    // Advance to Step 2
    await user.click(screen.getByRole('button', { name: 'Next' }));

    await waitFor(() => {
      const raw = localStorage.getItem('macroactive-onboarding-draft');
      expect(raw).not.toBeNull();
      const draft = JSON.parse(raw!);
      expect(draft.currentStep).toBe(2);
      expect(draft.formData.first_name).toBe('Alice');
      expect(draft.formData.last_name).toBe('Smith');
      expect(draft.formData.timezone).toBe('Pacific/Auckland');
    });
  });
});
