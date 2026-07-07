Overview

I will build a 3-step onboarding wizard using Next.js App Router, TypeScript, Tailwind, and Vitest component tests.

The wizard will collect a new MacroActive client’s onboarding details across three steps:

Personal details
Fitness profile
Dietary preferences

The user will be able to move forward and backward through the wizard while keeping all previously entered data. On the final step, clicking Finish will submit the complete onboarding profile to the mock API in one single POST /api/onboarding request.

The wizard will also save a draft to localStorage so that if the user leaves halfway through and returns later, their current step and entered form values are restored.

The most important design decision is that the full form data will live in the parent wizard component, not inside each individual step component. This avoids losing step data when navigating backward and forward.

State management design

The previous developer suggested using separate useState inside each step component.

I will not use that as the main state model.

That approach looks clean at first, but it causes a problem when the user navigates between steps. If Step 2 owns its own local state, that data only exists while Step 2 is mounted. When the user clicks Back to Step 1, Step 2 may unmount. When the user goes forward again, Step 2 may remount with empty default values.

That would fail the requirement that Step 2 data must still be populated if the user goes Back to Step 1 and then forward again.

Instead, the parent wizard component will own the source of truth.

The parent wizard will store:

currentStep
formData
errors
isSubmitting
submitError
successMessage
hasRestoredDraft

The formData object will contain all fields from all three steps:

type OnboardingFormData = {
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

I will store weight_kg and height_cm as strings in the form state because input values from HTML fields are strings. Before submitting to the API, I will convert them to numbers.

Each step component will receive only the values and handlers it needs.

For example:

<PersonalDetailsStep
  values={formData}
  errors={errors}
  onChange={updateField}
/>

The step components will be controlled components. They will render inputs, display errors, and call the parent update handler when a value changes. They will not own the final source of truth.

This design means:

Back/Next navigation will not destroy entered data
Step 2 data will stay populated after returning to Step 1
The final API submission can access the complete form object
Draft save is simpler because one parent state object can be saved
Draft restore is simpler because one saved object can hydrate the wizard
Component structure

I will keep the UI split into small components while keeping the form state in the parent.

Planned structure:

app/
  page.tsx
  api/
    onboarding/
      route.ts

components/
  OnboardingWizard.tsx
  StepIndicator.tsx
  PersonalDetailsStep.tsx
  FitnessProfileStep.tsx
  DietaryPreferencesStep.tsx

lib/
  onboarding.ts
app/page.tsx

This will render the main onboarding page and include the OnboardingWizard component.

components/OnboardingWizard.tsx

This will be the main client component.

It will include:

use client
parent-owned form state
current step state
validation logic
localStorage restore/save logic
navigation handlers
final submit handler
components/StepIndicator.tsx

This will display:

Step X of 3

It may also show the step names visually if useful, but the required output is the simple progress indicator.

components/PersonalDetailsStep.tsx

This will render Step 1 fields:

first name
last name
date of birth
timezone
components/FitnessProfileStep.tsx

This will render Step 2 fields:

goal
activity level
current weight in kg
height in cm
components/DietaryPreferencesStep.tsx

This will render Step 3 fields:

preferred macro split
dietary restrictions
lib/onboarding.ts

This file will contain shared types and helper functions such as:

OnboardingFormData
DEFAULT_FORM_DATA
step field lists
validation helpers
draft storage key

This keeps the wizard component smaller and makes validation easier to test or reuse.

Mock API design

The mock API route will be:

POST /api/onboarding

The route handler file will be:

app/api/onboarding/route.ts

The API will accept the complete onboarding profile object:

type SubmittedOnboardingProfile = {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  timezone: string;
  goal: 'lose' | 'maintain' | 'gain';
  activity_level: string;
  weight_kg: number;
  height_cm: number;
  macro_split: 'high-protein' | 'balanced' | 'low-carb';
  dietary_restrictions: string;
};

The route handler will:

Parse the JSON request body.
Validate that all required fields exist.
Validate that weight_kg and height_cm are positive numbers.
Store the submitted data in a module-level variable.
Return a success JSON response if valid.
Return an error JSON response if invalid.

Example success response:

{
  "message": "Onboarding complete"
}

Example error response:

{
  "error": "Missing required onboarding fields"
}

The module-level variable will only be used for this mock task. It is not persistent storage and will reset when the server restarts.

I will not submit data to the API step-by-step. The brief requires one final call only when the user clicks Finish.

Form fields
Step 1 — Personal details

Fields:

first_name: string;
last_name: string;
date_of_birth: string;
timezone: string;

Inputs:

first_name: text input
last_name: text input
date_of_birth: date input
timezone: select input

The timezone select will include a small set of common timezone values, including:

Pacific/Auckland
Australia/Sydney
Europe/London
America/New_York
America/Los_Angeles

The brief does not require a full timezone database, so a small list is enough for this prototype.

Step 2 — Fitness profile

Fields:

goal: 'lose' | 'maintain' | 'gain' | '';
activity_level: string;
weight_kg: string;
height_cm: string;

Inputs:

goal: select input
activity_level: select input
weight_kg: number input
height_cm: number input

Goal options:

lose
maintain
gain

Activity level options:

sedentary
light
moderate
active
very-active

The brief only gives moderate in the example payload and does not define every allowed activity level. I will use this small set of sensible options.

Step 3 — Dietary preferences

Fields:

macro_split: 'high-protein' | 'balanced' | 'low-carb' | '';
dietary_restrictions: string;

Inputs:

macro_split: select input
dietary_restrictions: textarea

Macro split options:

high-protein
balanced
low-carb

dietary_restrictions is optional because the brief says it is free text and optional.

Validation approach

Validation will happen one step at a time.

When the user clicks Next, the wizard will validate only the current step’s fields. It will not validate future steps before the user reaches them.

This matches the acceptance criteria.

Step 1 validation

When the user clicks Next on Step 1, validate only:

first_name
last_name
date_of_birth
timezone

Rules:

each field is required
empty strings are invalid

Step 2 and Step 3 fields will not be validated at this point.

Step 2 validation

When the user clicks Next on Step 2, validate only:

goal
activity_level
weight_kg
height_cm

Rules:

goal is required
activity_level is required
weight_kg is required
weight_kg must be a positive number
height_cm is required
height_cm must be a positive number
Step 3 validation

When the user clicks Finish on Step 3, validate:

macro_split

Rules:

macro_split is required
dietary_restrictions is optional

After Step 3 passes validation, the wizard will submit the complete profile object to the API.

Error display

Validation errors will be stored in the parent component as an object keyed by field name.

Example:

{
  first_name: 'First name is required',
  weight_kg: 'Weight must be a positive number'
}

Each step component will receive the current errors object and display the error under the matching field.

When a user changes a field, I may clear that field’s error so the user gets immediate feedback.

Navigation design

The wizard will track the current step using:

currentStep: 1 | 2 | 3

The progress indicator will display:

Step 1 of 3
Step 2 of 3
Step 3 of 3

Navigation buttons:

Step 1
Show Next
Hide or disable Back
Step 2
Show Back
Show Next
Step 3
Show Back
Show Finish
Next behaviour

When Next is clicked:

Validate the current step.
If validation fails, stay on the same step and show errors.
If validation passes, move to the next step.
Back behaviour

When Back is clicked:

Move to the previous step.
Do not validate fields.
Do not clear form data.
Do not reset errors unless they are no longer relevant.

Because the full form data lives in the parent component, moving backward will not destroy Step 2 or Step 3 values.

Finish behaviour

When Finish is clicked:

Validate Step 3.
If Step 3 validation fails, stay on Step 3.
If valid, build the final API payload.
Convert weight_kg and height_cm from strings to numbers.
Send one POST /api/onboarding request.
If successful, clear the localStorage draft and show a success message.
If failed, stay on Step 3, show an error, and preserve all form values.
Draft save and restore strategy

The draft will be stored in localStorage.

Storage key:

const DRAFT_STORAGE_KEY = 'macroactive-onboarding-draft';

Saved draft shape:

type OnboardingDraft = {
  currentStep: 1 | 2 | 3;
  formData: OnboardingFormData;
};

Example saved draft:

{
  "currentStep": 2,
  "formData": {
    "first_name": "Alice",
    "last_name": "Smith",
    "date_of_birth": "1995-04-12",
    "timezone": "Pacific/Auckland",
    "goal": "lose",
    "activity_level": "moderate",
    "weight_kg": "72",
    "height_cm": "165",
    "macro_split": "",
    "dietary_restrictions": ""
  }
}
Restore on first load

Because this is a Next.js App Router project, I cannot safely read localStorage during server-side rendering.

The wizard component will be a client component using:

'use client';

The restore logic will run inside useEffect.

Restore flow:

Render the wizard with safe default empty state.
After the component mounts in the browser, read from localStorage.
If no draft exists, continue with default state.
If a draft exists, parse it.
If the draft is valid, set formData and currentStep.
Mark draft restore as complete with hasRestoredDraft.
Preventing draft overwrite during first render

One important edge case is that the save effect could run before the restore effect finishes. If that happens, the empty default state could overwrite the existing saved draft.

To prevent that, I will use a flag such as:

const [hasRestoredDraft, setHasRestoredDraft] = useState(false);

The save effect will only run after hasRestoredDraft is true.

Save flow:

useEffect(() => {
  if (!hasRestoredDraft) {
    return;
  }

  localStorage.setItem(
    DRAFT_STORAGE_KEY,
    JSON.stringify({ currentStep, formData })
  );
}, [currentStep, formData, hasRestoredDraft]);
When to save

The brief says to save wizard state on every step change.

I will save whenever either currentStep or formData changes. This is slightly stronger than only saving during navigation and better protects user data if they type something and then close the tab before changing steps.

Clearing the draft

After a successful API submission, I will call:

localStorage.removeItem(DRAFT_STORAGE_KEY);

I will only clear the draft after the API response succeeds.

If the API fails, I will not clear the draft and I will not reset the form.

Single-submit API design

The wizard will submit only once, on Step 3, when the user clicks Finish.

It will not call the API on Step 1 or Step 2.

This matters because the onboarding profile is one complete object. Sending one request avoids partial backend state and matches the acceptance criteria that the Network tab should show one API call on finish.

Submit payload:

const payload = {
  ...formData,
  weight_kg: Number(formData.weight_kg),
  height_cm: Number(formData.height_cm),
};

Submit request:

await fetch('/api/onboarding', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(payload),
});

Failure behaviour:

stay on Step 3
show an error message
keep all form data populated
keep the draft in localStorage

Success behaviour:

show success message
clear localStorage draft
prevent duplicate accidental submissions by using isSubmitting
Libraries and packages
Next.js App Router

Used for the app structure, page rendering, and API route handler.

React

Used for state, controlled form inputs, and component composition.

TypeScript

Used for typed form data, step values, validation helpers, and API payloads.

Tailwind CSS

Used for quick styling of the wizard, form fields, buttons, errors, and success states.

Vitest

Used for component tests.

@vitejs/plugin-react

Used so Vitest can run React component tests.

React Testing Library

Used to test the wizard from the user’s perspective by interacting with inputs and buttons.

@testing-library/user-event

Used to simulate realistic user actions like typing, selecting options, and clicking buttons.

jsdom

Used to provide browser-like APIs during tests, including localStorage.

Test strategy

I will write tests around the key acceptance criteria.

Required tests:

1. Next does not advance if required fields are empty

Test flow:

Render the wizard.
Confirm it starts on Step 1.
Click Next without entering required Step 1 fields.
Confirm the page still shows Step 1 of 3.
Confirm validation errors are visible.

This proves current-step validation prevents invalid navigation.

2. Back preserves Step 2 data

Test flow:

Fill valid Step 1 data.
Click Next to reach Step 2.
Enter Step 2 values.
Click Back to Step 1.
Click Next to return to Step 2.
Confirm the Step 2 values are still populated.

This proves parent-owned state preserves data across component unmount/remount.

3. Wizard state saves to localStorage on step change

Test flow:

Render the wizard.
Fill valid Step 1 data.
Click Next.
Read the saved draft from localStorage.
Confirm it includes currentStep: 2.
Confirm it includes the Step 1 values.

This proves draft saving works.

Additional useful tests if time allows:

4. Restores draft from localStorage

Test flow:

Put a saved draft into localStorage.
Render the wizard.
Confirm it restores the saved step and field values.
5. Finish submits one API call

Test flow:

Mock fetch.
Fill all three steps.
Click Finish.
Confirm fetch was called once.
Confirm the request body contains all fields.
6. API failure keeps user on Step 3

Test flow:

Mock fetch to return an error.
Fill all steps.
Click Finish.
Confirm the wizard still shows Step 3.
Confirm form values remain populated.
Confirm error message is shown.
File and commit workflow

I will follow the workflow order.

Phase 1

Create and commit:

UNDERSTANDING.md
Phase 2

Create and commit:

ESTIMATE.md
Phase 4

Create and commit:

APPROACH.md
Implementation

Create:

app/page.tsx
app/api/onboarding/route.ts
components/OnboardingWizard.tsx
components/StepIndicator.tsx
components/PersonalDetailsStep.tsx
components/FitnessProfileStep.tsx
components/DietaryPreferencesStep.tsx
lib/onboarding.ts
Tests

Create:

components/OnboardingWizard.test.tsx
vitest.config.ts
test/setup.ts
Before and after evidence

Create:

BEFORE-AFTER.md

This file will include pasted terminal output for:

before implementation
failing tests
passing tests
build result if required
Edge cases
Step data lost when navigating backward

Risk:

If each step owns local state, step data can disappear when the component unmounts.

Solution:

Keep the full formData object in the parent wizard component.

User clicks Next with empty required fields

Risk:

The wizard could advance without required data.

Solution:

Validate the current step before changing currentStep.

Future-step fields validating too early

Risk:

The user could see Step 3 errors while still on Step 1.

Solution:

Only validate the active step.

Weight and height entered as strings

Risk:

HTML inputs return strings, but the API example uses numbers.

Solution:

Store them as strings in form state, validate that they are positive numbers, then convert to numbers before API submission.

localStorage is not available during server-side rendering

Risk:

Reading localStorage too early can cause runtime errors or hydration problems.

Solution:

Use a client component and read localStorage only inside useEffect.

Existing draft overwritten by empty defaults

Risk:

A save effect may run before restore and replace the old draft with empty state.

Solution:

Use hasRestoredDraft and only save after restore has completed.

Invalid JSON in localStorage

Risk:

A corrupted draft could crash the wizard.

Solution:

Wrap JSON.parse in try/catch. If parsing fails, remove the invalid draft and continue with empty defaults.

Draft has invalid current step

Risk:

The saved draft could contain currentStep: 99.

Solution:

Validate restored currentStep and only allow 1, 2, or 3. Otherwise default to Step 1.

Draft is missing fields

Risk:

Older or broken draft data may not include every form field.

Solution:

Merge restored data over DEFAULT_FORM_DATA so missing fields still have safe defaults.

API request fails

Risk:

User could lose their completed form after a failed submit.

Solution:

Do not reset state and do not clear localStorage unless the API returns success. Show an error and keep the user on Step 3.

Double submit

Risk:

The user could click Finish multiple times.

Solution:

Use isSubmitting to disable the Finish button while the request is in progress.

Successful submit does not define a redirect

Risk:

The brief does not say where to send the user after success.

Solution:

Show an inline success message and clear the draft. Do not redirect unless later required.

Decisions made from ambiguous parts of the brief
Activity level options

The brief does not define all activity levels.

I will use:

sedentary
light
moderate
active
very-active

This includes the example value moderate.

Timezone input

The brief does not require a full timezone picker.

I will use a select with a small set of timezone values, including Pacific/Auckland.

Draft save timing

The brief says to save on every step change.

I will save on both form value changes and step changes to better protect the user’s progress.

Submission success behaviour

The brief does not specify a redirect.

I will display a success message and clear the draft.

API failure simulation

The brief asks to simulate failure but does not define a special trigger.

I will handle API failures through normal error responses, invalid payload validation, and mocked fetch in tests.

Final implementation plan
Set up the Next.js project and test environment.
Create shared onboarding types and constants.
Build the mock POST /api/onboarding route.
Build the parent-controlled OnboardingWizard.
Build the three controlled step components.
Add step-by-step validation.
Add Back/Next/Finish navigation.
Add localStorage restore and save logic.
Add single API submission on Finish.
Add error and success states.
Write failing tests for required behaviours.
Implement/fix until tests pass.
Manually verify navigation, draft restore, single API request, and failure handling.
Paste terminal output into BEFORE-AFTER.md.
Summary

The implementation will use parent-owned form state, controlled step components, browser-safe localStorage restore, current-step-only validation, and one final API submission.

This design directly supports the acceptance criteria:

data is preserved when moving backward and forward
only current-step fields are validated
the final payload is submitted in one API call
failed submission keeps the user on Step 3
localStorage restores unfinished onboarding progress
localStorage is cleared only after a successful submission