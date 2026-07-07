What is the task asking me to build?

This task is asking me to build a small multi-step onboarding wizard using Next.js App Router, TypeScript, Tailwind, and component tests with Vitest.

The wizard is for new MacroActive clients. It collects the information needed to configure their dashboard, macro targets, and program setup.

The onboarding flow has three steps:
                                    1. Personal details
                                    2. Fitness profile
                                    3. Dietary preferences

The user should be able to move forward and backward through the wizard without losing any entered data. When the user reaches the final step and clicks “Finish”, the complete onboarding profile should be submitted to the mock API in one single request.

The wizard also needs draft saving. If the user leaves the page halfway through and comes back later, their current step and all previously entered form values should be restored from localStorage.

I also need to set up component testing with Vitest and jsdom, then write tests for validation, back navigation data preservation, and localStorage draft saving.

-------------------------------------------------------------------------------------------------------------------------------------------------

What inputs does the wizard take?

Step 1 — Personal details
                        first_name
                        last_name
                        date_of_birth
                        timezone

Step 2 — Fitness profile
                        goal
                            lose
                            maintain
                            gain
                        activity_level
                        weight_kg
                        height_cm

Step 3 — Dietary preferences
                        macro_split
                            high-protein
                            balanced
                            low-carb
                        dietary_restrictions
                            optional free text field

-------------------------------------------------------------------------------------------------------------------------------------------------

What does it return or display?

The page displays:

                A progress indicator showing Step X of 3
                The current step form
                Navigation buttons:
                    Back
                    Next
                    Finish on the final step
                Validation errors when required current-step fields are missing
                An API error message if final submission fails
                A success message or completion state after onboarding is successfully submitted

The API route is:

POST /api/onboarding

It accepts the complete onboarding profile object:

{
  "first_name": "Alice",
  "last_name": "Smith",
  "date_of_birth": "1995-04-12",
  "timezone": "Pacific/Auckland",
  "goal": "lose",
  "activity_level": "moderate",
  "weight_kg": 72,
  "height_cm": 165,
  "macro_split": "high-protein",
  "dietary_restrictions": ""
}

On success, it returns:

{
  "message": "Onboarding complete"
}

On failure, it returns:

{
  "error": "..."
}

The submitted data can be stored in a module-level variable because this is only a mock API.

-------------------------------------------------------------------------------------------------------------------------------------------------

Evaluation of the previous developer’s per-step state approach

The previous developer suggested that each step should own its own state with useState inside each step component.

This seems clean at first because each step is isolated and easy to test on its own. However, it causes problems in a multi-step wizard where data needs to survive navigation.

If Step 2 owns its own local state, then Step 2’s data only exists while the Step 2 component is mounted. When the user clicks Back to return to Step 1, the Step 2 component may unmount. If the user then clicks Next to go forward again, Step 2 may mount fresh with empty default values.

That means data entered on Step 2 can be lost when navigating backwards and forwards.

This approach also makes final submission harder because the parent wizard needs all step data at once for a single API call. If the data is spread across isolated step components, the parent either cannot access it easily or needs extra syncing logic, which defeats the simplicity of the per-step state approach.

My conclusion is that per-step local state is not the right primary state model for this task.

The better approach is to keep the full onboarding form data in the parent wizard component, then pass each step its relevant values and change handlers. This keeps data preserved across step navigation, supports localStorage draft saving, and makes the final single API submission straightforward.

-------------------------------------------------------------------------------------------------------------------------------------------------

Where the form data lives and why

The collected form data should live in the parent wizard component.

The parent wizard should own:
                            currentStep
                            the complete formData object
                            validation errors
                            submit loading state
                            API error state
                            restored draft state

Each step component should receive only the fields it needs as props. The step components can still be small and testable, but they should not be the source of truth for the final onboarding data.

This design is better because:

        Back/Next navigation does not destroy form data
        Step 2 data stays populated after going Back to Step 1 and forward again
        The full profile is already available when clicking Finish
        Saving to localStorage is simple because the parent has the full wizard state
        Restoring from localStorage is simple because one saved object can hydrate the parent state

-------------------------------------------------------------------------------------------------------------------------------------------------

How localStorage restore interacts with Next.js server-side rendering

localStorage only exists in the browser. It does not exist during server-side rendering.

Because this is a Next.js App Router project, the wizard component must be a client component using:

'use client';

Even inside a client component, I should not read localStorage directly during the initial render because that can cause hydration issues or runtime errors if the code runs before the browser environment is available.

The correct approach is to restore the draft inside a useEffect, because useEffect only runs in the browser after the component mounts.

The flow should be:
                    Render the wizard with safe default empty values.
                    After mount, check localStorage for an existing draft.
                    If a draft exists and is valid JSON, update formData and currentStep.
                    Continue saving changes back to localStorage whenever wizard state changes.

I need to be careful that the first save effect does not immediately overwrite an existing draft before the restore effect has read it. I can handle this with a hasRestoredDraft flag or by structuring the restore/save effects carefully.

-------------------------------------------------------------------------------------------------------------------------------------------------

Why the API submit must be a single call rather than one call per step

The brief says the user clicks Finish on Step 3 and then all the data is submitted to the API in one call.

This matters because the onboarding profile is one complete setup object. Sending each step separately could create partial data on the backend, make rollback/error handling harder, and fail the Network tab expectation where only one API call should fire when finishing.

The wizard should validate each step before advancing, but it should only submit to the API once the user finishes Step 3.

-------------------------------------------------------------------------------------------------------------------------------------------------

Current-step validation

When the user clicks Next, only the current step should be validated.

For example, if the user is on Step 1 and clicks Next, the wizard should validate only:

            first_name
            last_name
            date_of_birth
            timezone

It should not validate Step 2 or Step 3 fields at that moment because the user has not reached those steps yet.

When the user is on Step 2 and clicks Next, it should validate only:

    goal
    activity_level
    weight_kg
    height_cm

When the user is on Step 3 and clicks Finish, it should validate Step 3 fields and then submit the full data object.

The only optional field appears to be:

        dietary_restrictions

All other listed fields are required unless the brief says otherwise.

-------------------------------------------------------------------------------------------------------------------------------------------------

Exact validation rules are not fully specified

The brief says empty required fields should prevent advancing, but it does not define detailed validation rules.

I will keep validation simple unless told otherwise:

        required text/select fields cannot be empty
        weight_kg and height_cm must be positive numbers
        dietary_restrictions is optional

---------------------------------------------------------------

Activity level options are not defined

I will define the options as:

sedentary
light
moderate
active
very-active

This keeps the form usable while matching the example.

---------------------------------------------------------------

Timezone input type is not specified

For this prototype, I will likely use a select with a small set of common timezone options, including Pacific/Auckland. This keeps the UI simple and testable.

---------------------------------------------------------------

What should happen after successful submission is not fully specified

I will show a success message on the page and clear the saved draft. I will not redirect unless the brief later requires it.

---------------------------------------------------------------

API failure simulation is not specified

I can support this in the mock API with basic validation. For example, if required fields are missing from the submitted payload, the API returns an error.

For manual testing, I could temporarily force the route handler to return a 500 response or mock fetch failure in a test.

---------------------------------------------------------------

Draft save timing needs interpretation

To avoid data loss, I will save the draft whenever currentStep or formData changes. This is stronger than only saving on navigation and better matches the goal of preserving partially completed forms.

---------------------------------------------------------------

Module-level API storage is only temporary

I understand this means the data is not persistent across server restarts and may not behave like a real database in production. That is acceptable for this mock task.