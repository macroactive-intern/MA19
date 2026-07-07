BEFORE — failing tests

Output after first test commit (e9b3e16), before alias fix:

> onboarding-wizard@0.1.0 test
> vitest run


 RUN  v4.1.10 C:/Users/mccor/Desktop/Projects/MacroActive/MA19/onboarding-wizard

 ❯ components/OnboardingWizard.test.tsx (0 test)

⎯⎯⎯⎯⎯⎯ Failed Suites 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  components/OnboardingWizard.test.tsx [ components/OnboardingWizard.test.tsx ]
Error: Failed to resolve import "@/components/OnboardingWizard" from "components/OnboardingWizard.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: C:/Users/mccor/Desktop/Projects/MacroActive/MA19/onboarding-wizard/components/OnboardingWizard.test.tsx:3:29
  1  |  import { fireEvent, render, screen, waitFor } from "@testing-library/react";
  2  |  import userEvent from "@testing-library/user-event";
  3  |  import OnboardingWizard from "@/components/OnboardingWizard";
     |                                ^

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯

 Test Files  1 failed (1)
      Tests  no tests
   Start at  13:55:48
   Duration  1.54s (transform 26ms, setup 143ms, import 0ms, tests 0ms, environment 1.18s)

Fix applied: added resolve.alias { '@': process.cwd() } to vitest.config.ts so Vitest
resolves the @/ path alias the same way Next.js/TypeScript do via tsconfig paths.

--------------------------------------------------------------------------------

AFTER — passing tests

Output after fix commit, vitest.config.ts updated:

> onboarding-wizard@0.1.0 test
> vitest run


 RUN  v4.1.10 C:/Users/mccor/Desktop/Projects/MacroActive/MA19/onboarding-wizard


 Test Files  1 passed (1)
      Tests  3 passed (3)
   Start at  14:02:32
   Duration  2.70s (transform 79ms, setup 118ms, import 222ms, tests 1.31s, environment 899ms)

Tests passing:
  - Next does not advance if required fields are empty
  - Back preserves Step 2 data
  - Wizard state saves to localStorage on step change
