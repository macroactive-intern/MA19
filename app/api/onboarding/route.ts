import { NextRequest, NextResponse } from 'next/server';

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

const VALID_GOALS = ['lose', 'maintain', 'gain'] as const;
const VALID_MACRO_SPLITS = ['high-protein', 'balanced', 'low-carb'] as const;
const REQUIRED_FIELDS: (keyof SubmittedOnboardingProfile)[] = [
  'first_name',
  'last_name',
  'date_of_birth',
  'timezone',
  'goal',
  'activity_level',
  'weight_kg',
  'height_cm',
  'macro_split',
];

let lastSubmission: SubmittedOnboardingProfile | null = null;

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const data = body as Record<string, unknown>;

  for (const field of REQUIRED_FIELDS) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      return NextResponse.json(
        { error: 'Missing required onboarding fields' },
        { status: 400 },
      );
    }
  }

  if (!VALID_GOALS.includes(data.goal as (typeof VALID_GOALS)[number])) {
    return NextResponse.json({ error: 'Invalid goal value' }, { status: 400 });
  }

  if (!VALID_MACRO_SPLITS.includes(data.macro_split as (typeof VALID_MACRO_SPLITS)[number])) {
    return NextResponse.json({ error: 'Invalid macro_split value' }, { status: 400 });
  }

  const weight = Number(data.weight_kg);
  const height = Number(data.height_cm);

  if (!Number.isFinite(weight) || weight <= 0) {
    return NextResponse.json(
      { error: 'weight_kg must be a positive number' },
      { status: 400 },
    );
  }

  if (!Number.isFinite(height) || height <= 0) {
    return NextResponse.json(
      { error: 'height_cm must be a positive number' },
      { status: 400 },
    );
  }

  lastSubmission = {
    first_name: String(data.first_name),
    last_name: String(data.last_name),
    date_of_birth: String(data.date_of_birth),
    timezone: String(data.timezone),
    goal: data.goal as SubmittedOnboardingProfile['goal'],
    activity_level: String(data.activity_level),
    weight_kg: weight,
    height_cm: height,
    macro_split: data.macro_split as SubmittedOnboardingProfile['macro_split'],
    dietary_restrictions: String(data.dietary_restrictions ?? ''),
  };

  return NextResponse.json({ message: 'Onboarding complete' }, { status: 200 });
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ submission: lastSubmission });
}
