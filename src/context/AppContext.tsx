import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  FoodLogItem,
  WeightEntry,
  MealType,
  AIAnalysisResult,
  MacroSummary,
} from '../types';
import { calculateNutritionTargets } from '../utils/nutritionCalculations';

interface AppContextType {
  userProfile: UserProfile;
  foodLogs: FoodLogItem[];
  weightEntries: WeightEntry[];
  selectedDate: string;
  activeTab: 'home' | 'analytics' | 'settings' | 'diary' | 'progress' | 'profile';
  isScannerOpen: boolean;
  isSearchOpen: boolean;
  targetMealType: MealType;
  aiResultData: AIAnalysisResult | null;
  editingLogItem: FoodLogItem | null;

  // Actions
  setSelectedDate: (date: string) => void;
  setActiveTab: (tab: 'home' | 'analytics' | 'settings' | 'diary' | 'progress' | 'profile') => void;
  openScanner: (mealType?: MealType) => void;
  closeScanner: () => void;
  openSearch: (mealType?: MealType) => void;
  closeSearch: () => void;
  setAiResultData: (result: AIAnalysisResult | null) => void;
  setEditingLogItem: (item: FoodLogItem | null) => void;

  updateProfile: (updates: Partial<UserProfile>) => void;
  finishOnboarding: (profile: UserProfile) => void;
  resetToOnboarding: () => void;

  addFoodLog: (item: Omit<FoodLogItem, 'id' | 'createdAt'>) => void;
  updateFoodLog: (id: string, updates: Partial<FoodLogItem>) => void;
  deleteFoodLog: (id: string) => void;
  duplicateFoodLog: (id: string, targetMeal?: MealType) => void;

  addWeightEntry: (weight: number, date?: string, note?: string) => void;

  // Computed
  getDaySummary: (dateStr: string) => {
    consumed: MacroSummary;
    target: MacroSummary;
    remainingCalories: number;
    adherencePercent: number;
    mealLogs: Record<MealType, FoodLogItem[]>;
  };
}

const DEFAULT_PROFILE: UserProfile = {
  id: 'user_1',
  name: 'User',
  age: 26,
  gender: 'female',
  height: 165,
  weight: 60.0,
  targetWeight: 55.0,
  activityLevel: 'moderate',
  goal: 'lose',
  dietPreference: 'vegetarian',
  dailyCalories: 1000,
  proteinTarget: 100,
  carbTarget: 99,
  fatTarget: 25,
  fiberTarget: 25,
  weightUnit: 'kg',
  heightUnit: 'cm',
  isOnboarded: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

function getTodayString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getPastDateString(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const SEED_FOOD_LOGS: FoodLogItem[] = [];

const SEED_WEIGHT_ENTRIES: WeightEntry[] = [
  { id: 'w_1', date: getPastDateString(14), weight: 75.8, note: 'Starting tracker' },
  { id: 'w_2', date: getPastDateString(10), weight: 75.2 },
  { id: 'w_3', date: getPastDateString(7), weight: 74.9, note: 'Post morning walk' },
  { id: 'w_4', date: getPastDateString(4), weight: 74.7 },
  { id: 'w_5', date: getPastDateString(2), weight: 74.5 },
  { id: 'w_6', date: getTodayString(), weight: 74.2, note: 'Fastest trend yet' },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const isMigrated = localStorage.getItem('calai_v2_ready');
      if (!isMigrated) {
        localStorage.setItem('calai_v2_ready', 'true');
        localStorage.removeItem('aahar_food_logs');
        localStorage.setItem('aahar_profile', JSON.stringify(DEFAULT_PROFILE));
        return DEFAULT_PROFILE;
      }
      const saved = localStorage.getItem('aahar_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_PROFILE;
  });

  const [foodLogs, setFoodLogs] = useState<FoodLogItem[]>(() => {
    try {
      const saved = localStorage.getItem('aahar_food_logs');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return SEED_FOOD_LOGS;
  });

  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>(() => {
    try {
      const saved = localStorage.getItem('aahar_weights');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return SEED_WEIGHT_ENTRIES;
  });

  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());
  const [activeTab, setActiveTab] = useState<'home' | 'analytics' | 'settings' | 'diary' | 'progress' | 'profile'>('home');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [targetMealType, setTargetMealType] = useState<MealType>('breakfast');
  const [aiResultData, setAiResultData] = useState<AIAnalysisResult | null>(null);
  const [editingLogItem, setEditingLogItem] = useState<FoodLogItem | null>(null);

  // Sync state to local storage
  useEffect(() => {
    try {
      localStorage.setItem('aahar_profile', JSON.stringify(userProfile));
    } catch (e) {
      console.error(e);
    }
  }, [userProfile]);

  useEffect(() => {
    try {
      localStorage.setItem('aahar_food_logs', JSON.stringify(foodLogs));
    } catch (e) {
      console.error(e);
    }
  }, [foodLogs]);

  useEffect(() => {
    try {
      localStorage.setItem('aahar_weights', JSON.stringify(weightEntries));
    } catch (e) {
      console.error(e);
    }
  }, [weightEntries]);

  const openScanner = (mealType?: MealType) => {
    if (mealType) setTargetMealType(mealType);
    setIsScannerOpen(true);
  };

  const closeScanner = () => {
    setIsScannerOpen(false);
  };

  const openSearch = (mealType?: MealType) => {
    if (mealType) setTargetMealType(mealType);
    setIsSearchOpen(true);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUserProfile((prev) => {
      const updated = {
        ...prev,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      // Recalculate targets if physical metrics or goals change
      if (
        updates.weight !== undefined ||
        updates.targetWeight !== undefined ||
        updates.height !== undefined ||
        updates.age !== undefined ||
        updates.activityLevel !== undefined ||
        updates.goal !== undefined ||
        updates.gender !== undefined
      ) {
        const targets = calculateNutritionTargets({
          weightKg: updated.weight,
          targetWeightKg: updated.targetWeight,
          heightCm: updated.height,
          age: updated.age,
          gender: updated.gender,
          activityLevel: updated.activityLevel,
          goal: updated.goal,
        });
        updated.dailyCalories = targets.dailyCalories;
        updated.proteinTarget = targets.proteinGrams;
        updated.carbTarget = targets.carbsGrams;
        updated.fatTarget = targets.fatGrams;
        updated.fiberTarget = targets.fiberGrams;
      }
      return updated;
    });
  };

  const finishOnboarding = (profile: UserProfile) => {
    setUserProfile({
      ...profile,
      isOnboarded: true,
      updatedAt: new Date().toISOString(),
    });
    setActiveTab('home');
  };

  const resetToOnboarding = () => {
    setUserProfile((prev) => ({
      ...prev,
      isOnboarded: false,
    }));
  };

  const addFoodLog = (item: Omit<FoodLogItem, 'id' | 'createdAt'>) => {
    const newItem: FoodLogItem = {
      ...item,
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      createdAt: new Date().toISOString(),
    };
    setFoodLogs((prev) => [newItem, ...prev]);
  };

  const updateFoodLog = (id: string, updates: Partial<FoodLogItem>) => {
    setFoodLogs((prev) =>
      prev.map((log) => (log.id === id ? { ...log, ...updates } : log))
    );
  };

  const deleteFoodLog = (id: string) => {
    setFoodLogs((prev) => prev.filter((log) => log.id !== id));
  };

  const duplicateFoodLog = (id: string, targetMeal?: MealType) => {
    const original = foodLogs.find((l) => l.id === id);
    if (!original) return;
    const duplicated: FoodLogItem = {
      ...original,
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      mealType: targetMeal || original.mealType,
      date: selectedDate,
      createdAt: new Date().toISOString(),
    };
    setFoodLogs((prev) => [duplicated, ...prev]);
  };

  const addWeightEntry = (weight: number, date?: string, note?: string) => {
    const entryDate = date || selectedDate;
    const newEntry: WeightEntry = {
      id: 'w_' + Date.now(),
      date: entryDate,
      weight,
      note,
    };
    setWeightEntries((prev) => {
      // replace if same date or append and sort
      const filtered = prev.filter((e) => e.date !== entryDate);
      const updated = [...filtered, newEntry];
      return updated.sort((a, b) => a.date.localeCompare(b.date));
    });
    // also update current profile weight
    updateProfile({ weight });
  };

  const getDaySummary = (dateStr: string) => {
    const logsForDay = foodLogs.filter((l) => l.date === dateStr);

    const consumed: MacroSummary = logsForDay.reduce(
      (acc, curr) => {
        return {
          calories: acc.calories + curr.calories,
          protein: acc.protein + curr.protein,
          carbs: acc.carbs + curr.carbs,
          fat: acc.fat + curr.fat,
          fiber: acc.fiber + (curr.fiber || 0),
        };
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    );

    consumed.calories = Math.round(consumed.calories);
    consumed.protein = Number(consumed.protein.toFixed(1));
    consumed.carbs = Number(consumed.carbs.toFixed(1));
    consumed.fat = Number(consumed.fat.toFixed(1));
    consumed.fiber = Number(consumed.fiber.toFixed(1));

    const target: MacroSummary = {
      calories: userProfile.dailyCalories,
      protein: userProfile.proteinTarget,
      carbs: userProfile.carbTarget,
      fat: userProfile.fatTarget,
      fiber: userProfile.fiberTarget,
    };

    const remainingCalories = Math.max(0, target.calories - consumed.calories);
    const adherencePercent =
      target.calories > 0
        ? Math.min(150, Math.round((consumed.calories / target.calories) * 100))
        : 0;

    const mealLogs: Record<MealType, FoodLogItem[]> = {
      breakfast: logsForDay.filter((l) => l.mealType === 'breakfast'),
      lunch: logsForDay.filter((l) => l.mealType === 'lunch'),
      snack: logsForDay.filter((l) => l.mealType === 'snack'),
      dinner: logsForDay.filter((l) => l.mealType === 'dinner'),
    };

    return {
      consumed,
      target,
      remainingCalories,
      adherencePercent,
      mealLogs,
    };
  };

  return (
    <AppContext.Provider
      value={{
        userProfile,
        foodLogs,
        weightEntries,
        selectedDate,
        activeTab,
        isScannerOpen,
        isSearchOpen,
        targetMealType,
        aiResultData,
        editingLogItem,
        setSelectedDate,
        setActiveTab,
        openScanner,
        closeScanner,
        openSearch,
        closeSearch,
        setAiResultData,
        setEditingLogItem,
        updateProfile,
        finishOnboarding,
        resetToOnboarding,
        addFoodLog,
        updateFoodLog,
        deleteFoodLog,
        duplicateFoodLog,
        addWeightEntry,
        getDaySummary,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
