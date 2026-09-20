export type GoalType = 'lose' | 'maintain' | 'gain';

export type ActivityLevel =
  | 'sedentary'
  | 'light'
  | 'moderate'
  | 'very_active'
  | 'extremely_active';

export type DietPreference =
  | 'vegetarian'
  | 'non_vegetarian'
  | 'eggetarian'
  | 'vegan'
  | 'jain';

export type MealType = 'breakfast' | 'lunch' | 'snack' | 'dinner';

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number; // in cm
  weight: number; // in kg
  targetWeight: number; // in kg
  activityLevel: ActivityLevel;
  goal: GoalType;
  dietPreference: DietPreference;
  dailyCalories: number;
  proteinTarget: number; // grams
  carbTarget: number; // grams
  fatTarget: number; // grams
  fiberTarget: number; // grams
  weightUnit: 'kg' | 'lb';
  heightUnit: 'cm' | 'ft';
  isOnboarded: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FoodItemComponent {
  id?: string;
  name: string;
  estimatedServing: string;
  servingUnit?: string;
  quantity?: number;
  estimatedWeightGrams: number;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  fiberGrams?: number;
  regionalOrigin?: string;
}

export interface AIAnalysisResult {
  mealTitle: string;
  confidence: number;
  isUncertain?: boolean;
  alternatives?: string[];
  foodItems: FoodItemComponent[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
  insightTip?: string;
  imageUrl?: string;
  isSimulation?: boolean;
}

export interface FoodLogItem {
  id: string;
  userId?: string;
  date: string; // YYYY-MM-DD
  mealType: MealType;
  foodName: string;
  servingSize: string;
  quantity: number;
  weightGrams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  imageUrl?: string;
  source: 'ai' | 'manual';
  components?: FoodItemComponent[];
  createdAt: string;
}

export interface WeightEntry {
  id: string;
  date: string; // YYYY-MM-DD
  weight: number; // in kg
  note?: string;
}

export interface DatabaseFoodItem {
  id: string;
  name: string;
  hindiName?: string;
  category: 'breakfast' | 'main' | 'snack' | 'sweet' | 'beverage';
  regionalOrigin: string;
  defaultServing: string;
  defaultServingGrams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  dietTag: 'veg' | 'jain' | 'vegan' | 'eggetarian' | 'non_veg';
}

export interface MacroSummary {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}
