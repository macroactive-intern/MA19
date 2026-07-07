Step 1

    Documentation
                1. Write out the Understand.md
                2. Write out the Time Estimate.md
                3. Add the Ai Time estimate to the Estimate.md
                4. Write out the Aproach.md
                                                                                                        120 mins

----------------------------------------------------------------------------------------------------------------

Step 2

    Project set up
                1. Create the Next.js project
                                    Run npx create-next-app@latest onboarding-wizard --typescript --tailwind --app --no-src-dir
                                    cd onboarding-wizard
                                    Confirm the app runs with npm run dev
                
                2. Install test dependencies
                                    Install Vitest
                                    Install React plugin for Vite
                                    Install React Testing Library
                                    Install user-event
                                    Install jsdom
                
                3. Configure Vitest
                                    Create vitest.config.ts
                                    Set test environment to jsdom
                                    Configure React plugin
                                    Add test scripts to package.json
                                    Add a test setup file if needed
                                                                                                    15 mins

----------------------------------------------------------------------------------------------------------------

Step 3

    API route implementation

                1. Create route handler
                                    File: app/api/onboarding/route.ts
                
                2. Implement POST handler
                                    Parse JSON request body
                                    Validate required fields
                                    Store submitted data in module-level variable
                                    Return success JSON on valid request
                                    Return error JSON on invalid request
                
                3. Optional helper
                                    Add GET route for debugging stored submission, only if useful
                                    Not required by the brief
                
                4. Test API manually
                                    Submit valid payload
                                    Submit invalid payload
                                    Confirm response shape matches brief
                                                                                                    30 mins

----------------------------------------------------------------------------------------------------------------

Step 4

    Wizard implementation

                1. Create type definitions
                                    Define OnboardingFormData
                                    Define step field groups
                                    Define allowed values for goal and macro split
                
                2. Build parent wizard
                                    Add use client
                                    Add default empty form data
                                    Add currentStep
                                    Add errors
                                    Add isSubmitting
                                    Add submitError
                                    Add successMessage
                
                3. Build progress indicator
                                    Display Step X of 3
                
                4. Build Step 1 form
                                    First name input
                                    Last name input
                                    Date of birth input
                                    Timezone input/select
                                    Display field errors
                
                5. Build Step 2 form
                                    Goal select
                                    Activity level select/input
                                    Current weight input
                                    Height input
                                    Display field errors
                
                6. Build Step 3 form
                                    Macro split select
                                    Dietary restrictions textarea
                                    Display field errors
                
                7. Build navigation
                                    Hide/disable Back on Step 1
                                    Show Next on Step 1 and Step 2
                                    Show Finish on Step 3
                                    Back decreases step
                                    Next validates current step before advancing
                                    Finish validates Step 3 and submits all data
                
                8. Preserve data between steps
                                    Ensure Step 2 values stay populated after Back to Step 1 and forward again
                
                9. Add draft save
                                    Save wizard state to localStorage when form data or step changes
                                    Restore wizard state on first client load
                                    Clear draft after successful submission
                
                10. Add submission behavior
                                    Send one fetch('/api/onboarding') call
                                    Use method POST
                                    Send complete profile JSON
                                    Show API error on failure
                                    Do not reset data on failure
                                    Clear draft on success
                                                                                                    75 mins

----------------------------------------------------------------------------------------------------------------

Step 5

    Test implementation

                1. Set up test utilities
                                    Configure Testing Library
                                    Add jsdom setup if needed
                                    Mock fetch where required
                                    Clear localStorage between tests
                
                2. Write failing tests first
                                    Test Next does not advance if required fields are empty
                                    Test Back preserves Step 2 data
                                    Test wizard state saves to localStorage on step change
                
                3. Run tests and capture failing output
                                    Add failing output to BEFORE-AFTER.md
                
                4. Implement/fix code until tests pass
                5. Add passing output
                                    Paste successful terminal output into BEFORE-AFTER.md
                
                6. Commit tests and implementation
                                    First failing test commit required by workflow
                                    Then passing implementation commit
                                                                                                    90 mins

----------------------------------------------------------------------------------------------------------------

Step 6

    Run Tests
                                                                                                    20 mins

----------------------------------------------------------------------------------------------------------------

Step 7

    Fix any failing tests
                                                                                                    40 mins

----------------------------------------------------------------------------------------------------------------

Step 8

    Manual test
                                                                                                    45 mins

----------------------------------------------------------------------------------------------------------------

Step 9

    BEFORE-AFTER.md
                                                                                                    30 mins
----------------------------------------------------------------------------------------------------------------

                                                                                                    7.75 hrs

---------------------------------------------------------------------------------------------------------------- 

AI Estimate and Reconciliation

My manual estimate came to 7.75 hours.

The AI estimate came to roughly 7.9 hours, which is very close to my own estimate. This tells me my breakdown is realistic because both estimates account for the same main areas of work: documentation, project setup, Vitest configuration, API route implementation, wizard state management, localStorage draft saving, tests, manual QA, and the BEFORE-AFTER.md evidence.

The estimates are close because this task has clear requirements but several areas that can take extra time if issues appear. The biggest risk areas are:

setting up Vitest with Next.js and jsdom
handling localStorage safely with Next.js client-side rendering
preserving form data when navigating backward and forward
validating only the current step
making sure the final submit sends one API request only
writing tests that correctly mock browser behaviour

My estimate is good because it includes time for both building the feature and proving it works through tests and manual verification. It also includes time for documentation, which is a required part of the workflow and not just extra admin work.

The AI estimate is slightly higher because it allows more time for implementation and debugging, especially around wizard state and test setup. That is reasonable because small issues with localStorage, hydration, or React Testing Library can take time to fix.

Overall, I think my estimate of 7.75 hours is accurate, but I would treat 7.75–8 hours as the safer final range.