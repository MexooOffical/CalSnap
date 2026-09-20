import { ActivityLevel, GoalType, UserProfile } from '../types';

/**
 * Calculates Basal Metabolic Rate (BMR) using Mifflin-St Jeor formula
 */
export function calculateBMR(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: 'male' | 'female' | 'other'
): number {
  if (gender === 'female') {
    return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age - 161);
  }
  // male or other default
  return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age + 5);
}

/**
 * Activity level multipliers for TDEE (Total Daily Energy Expenditure)
 */
export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2, // Little to no exercise, desk job
  light: 1.375, // Light exercise 1-3 days/week
  moderate: 1.55, // Moderate exercise 3-5 days/week
  very_active: 1.725, // Hard exercise 6-7 days/week
  extremely_active: 1.9, // Very hard training or physical job
};

export const ACTIVITY_DESCRIPTIONS: Record<
  ActivityLevel,
  { title: string; subtitle: string }
> = {
  sedentary: {
    title: 'Sedentary',
    subtitle: 'Desk job, minimal daily movement',
  },
  light: {
    title: 'Lightly Active',
    subtitle: 'Walking, light activity 1–3 times a week',
  },
  moderate: {
    title: 'Moderately Active',
    subtitle: 'Active workout or brisk walking 3–5 days a week',
  },
  very_active: {
    title: 'Very Active',
    subtitle: 'Intense training or physical sport 6–7 days a week',
  },
  extremely_active: {
    title: 'Extremely Active',
    subtitle: 'Physical labor or double training sessions',
  },
};

/**
 * Calculates complete personalized nutrition targets
 */
export function calculateNutritionTargets(params: {
  weightKg: number;
  targetWeightKg: number;
  heightCm: number;
  age: number;
  gender: 'male' | 'female' | 'other';
  activityLevel: ActivityLevel;
  goal: GoalType;
}): {
  bmr: number;
  tdee: number;
  dailyCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  fiberGrams: number;
} {
  const bmr = calculateBMR(
    params.weightKg,
    params.heightCm,
    params.age,
    params.gender
  );
  const multiplier = ACTIVITY_MULTIPLIERS[params.activityLevel] || 1.375;
  const tdee = Math.round(bmr * multiplier);

  let targetCalories = tdee;

  if (params.goal === 'lose') {
    // 20% moderate deficit (~400-500 kcal)
    targetCalories = Math.round(tdee * 0.8);
    // Safe minimum floors
    const minSafe = params.gender === 'female' ? 1200 : 1500;
    targetCalories = Math.max(targetCalories, minSafe);
  } else if (params.goal === 'gain') {
    // 15% surplus (~300-400 kcal)
    targetCalories = Math.round(tdee * 1.15);
  }

  // Protein target: 1.6g to 2.0g per kg of reference weight (good for Indian vegetarian / non-veg retention)
  const proteinGrams = Math.round(Math.max(60, params.weightKg * 1.7));
  const proteinCalories = proteinGrams * 4;

  // Fat target: ~25% of total calories (essential fatty acids, mustard/peanut/ghee balance)
  const fatCalories = targetCalories * 0.25;
  const fatGrams = Math.round(fatCalories / 9);

  // Carbs target: remaining calories
  const remainingCalories = targetCalories - (proteinCalories + fatCalories);
  const carbsGrams = Math.round(Math.max(100, remainingCalories / 4));

  // Fiber target: 30-38g per day (essential for gut health and blood sugar regulation)
  const fiberGrams = Math.round(params.gender === 'female' ? 28 : 35);

  return {
    bmr,
    tdee,
    dailyCalories: targetCalories,
    proteinGrams,
    carbsGrams,
    fatGrams,
    fiberGrams,
  };
}

/**
 * Educational note formatter (strict adherence to non-medical disclaimer)
 */
export function getCalorieEducationalNotice(
  consumed: number,
  target: number
): string {
  const diff = consumed - target;
  if (Math.abs(diff) <= 100) {
    return 'Your caloric intake is aligned with your daily energy expenditure baseline.';
  }
  if (diff < -100) {
    return `Currently ${Math.abs(diff)} kcal below your daily energy target. Sustained moderate deficits may support gradual weight loss over time.`;
  }
  return `Currently ${diff} kcal above your target. Sustained surpluses may support weight gain or muscle recovery when paired with training.`;
}
