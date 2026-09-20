import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sliders, RotateCcw, Plus, Check } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { userProfile, updateProfile, foodLogs, addFoodLog } = useApp();

  const [calories, setCalories] = useState(userProfile.dailyCalories || 1000);
  const [protein, setProtein] = useState(userProfile.proteinTarget || 100);
  const [carbs, setCarbs] = useState(userProfile.carbTarget || 99);
  const [fat, setFat] = useState(userProfile.fatTarget || 25);
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSaveTargets = () => {
    updateProfile({
      dailyCalories: Number(calories),
      proteinTarget: Number(protein),
      carbTarget: Number(carbs),
      fatTarget: Number(fat),
    });
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2000);
  };

  const handleResetToScreenshotDefaults = () => {
    setCalories(1000);
    setProtein(100);
    setCarbs(99);
    setFat(25);
    updateProfile({
      dailyCalories: 1000,
      proteinTarget: 100,
      carbTarget: 99,
      fatTarget: 25,
    });
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2000);
  };

  const handleClearAllLogs = () => {
    localStorage.removeItem('aahar_food_logs');
    window.location.reload();
  };

  const handleAddSampleMeal = () => {
    addFoodLog({
      date: new Date().toISOString().split('T')[0],
      mealType: 'lunch',
      foodName: 'Paneer Butter Masala & 2 Naan',
      servingSize: '1 bowl + 2 naan',
      quantity: 1,
      weightGrams: 320,
      calories: 450,
      protein: 22,
      carbs: 48,
      fat: 16,
      fiber: 6,
      source: 'ai',
      imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&auto=format&fit=crop&q=80',
    });
  };

  return (
    <div id="settings-view" className="w-full pb-36 pt-1 space-y-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-1 pt-1">
        <h1 className="text-2xl font-black text-zinc-950 tracking-tight">
          Settings
        </h1>
        {savedMessage && (
          <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <Check className="w-3.5 h-3.5" />
            <span>Saved</span>
          </div>
        )}
      </div>

      {/* Daily Goals Card */}
      <div className="bg-white rounded-[28px] p-5 border border-zinc-100/80 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-zinc-700" />
            <h3 className="text-sm font-bold text-zinc-950">Daily Nutrition Targets</h3>
          </div>

          <button
            onClick={handleResetToScreenshotDefaults}
            className="text-[11px] font-bold text-zinc-500 hover:text-zinc-900 flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Default (1000 kcal)</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          {/* Calorie Goal */}
          <div className="bg-zinc-50 p-3 rounded-2xl border border-zinc-200/60">
            <label className="text-[11px] font-semibold text-zinc-500 block mb-1">
              Calories (kcal)
            </label>
            <input
              type="number"
              value={calories}
              onChange={(e) => setCalories(Number(e.target.value))}
              className="w-full bg-white px-3 py-1.5 rounded-xl border border-zinc-200 text-sm font-black text-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950"
            />
          </div>

          {/* Protein Goal */}
          <div className="bg-zinc-50 p-3 rounded-2xl border border-zinc-200/60">
            <label className="text-[11px] font-semibold text-zinc-500 block mb-1">
              Protein (g)
            </label>
            <input
              type="number"
              value={protein}
              onChange={(e) => setProtein(Number(e.target.value))}
              className="w-full bg-white px-3 py-1.5 rounded-xl border border-zinc-200 text-sm font-black text-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950"
            />
          </div>

          {/* Carbs Goal */}
          <div className="bg-zinc-50 p-3 rounded-2xl border border-zinc-200/60">
            <label className="text-[11px] font-semibold text-zinc-500 block mb-1">
              Carbs (g)
            </label>
            <input
              type="number"
              value={carbs}
              onChange={(e) => setCarbs(Number(e.target.value))}
              className="w-full bg-white px-3 py-1.5 rounded-xl border border-zinc-200 text-sm font-black text-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950"
            />
          </div>

          {/* Fat Goal */}
          <div className="bg-zinc-50 p-3 rounded-2xl border border-zinc-200/60">
            <label className="text-[11px] font-semibold text-zinc-500 block mb-1">
              Fat (g)
            </label>
            <input
              type="number"
              value={fat}
              onChange={(e) => setFat(Number(e.target.value))}
              className="w-full bg-white px-3 py-1.5 rounded-xl border border-zinc-200 text-sm font-black text-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950"
            />
          </div>
        </div>

        <button
          onClick={handleSaveTargets}
          className="w-full py-2.5 rounded-xl bg-zinc-950 hover:bg-black text-white text-xs font-bold transition active:scale-95"
        >
          Save Goals
        </button>
      </div>

      {/* Demo & Testing Card */}
      <div className="bg-white rounded-[28px] p-5 border border-zinc-100/80 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-3">
        <h3 className="text-sm font-bold text-zinc-950">
          Quick Actions & Testing
        </h3>

        <div className="flex flex-col gap-2">
          <button
            onClick={handleAddSampleMeal}
            className="w-full py-2.5 px-4 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Sample Meal to Recently Logged</span>
          </button>

          <button
            onClick={handleClearAllLogs}
            className="w-full py-2.5 px-4 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Clear All Logs (Reset to Empty State)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
