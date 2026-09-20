import React from 'react';
import { useApp } from '../context/AppContext';
import { CalorieArc } from './CalorieArc';
import { MealSection } from './MealSection';
import { MealType } from '../types';
import { Camera, Sparkles, Flame, Plus } from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    userProfile,
    selectedDate,
    getDaySummary,
    deleteFoodLog,
    duplicateFoodLog,
    openScanner,
    openSearch,
    setEditingLogItem,
  } = useApp();

  const daySummary = getDaySummary(selectedDate);

  // Dynamic greeting based on current local hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const MEALS: { type: MealType; title: string }[] = [
    { type: 'breakfast', title: 'Breakfast' },
    { type: 'lunch', title: 'Lunch' },
    { type: 'snack', title: 'Snacks & Chai' },
    { type: 'dinner', title: 'Dinner' },
  ];

  return (
    <div id="home-view" className="w-full pb-32 pt-2 space-y-4">
      {/* Top Greeting Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block">
            {new Date().toLocaleDateString('en-IN', {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
            })}
          </span>
          <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">
            {getGreeting()}, {userProfile.name}
          </h1>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100/80 rounded-full border border-zinc-200/50">
          <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span className="text-xs font-bold text-zinc-800">Day 6 Streak</span>
        </div>
      </div>

      {/* Minimalist Semi-circular Calorie Arc Gauge */}
      <CalorieArc
        consumed={daySummary.consumed}
        target={daySummary.target}
        remainingCalories={daySummary.remainingCalories}
      />

      {/* Large High-Contrast Primary "Scan Food" Card / CTA */}
      <div
        id="home-primary-scan-cta"
        onClick={() => openScanner()}
        className="w-full bg-zinc-900 hover:bg-black text-white rounded-3xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] cursor-pointer transition-all active:scale-[0.99] flex items-center justify-between group"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-white border border-zinc-700/60 group-hover:scale-105 transition-transform">
            <Camera className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold">Scan Food with AI</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Instant nutrition breakdown for any Indian meal
            </p>
          </div>
        </div>

        <div className="w-9 h-9 rounded-full bg-white text-zinc-900 flex items-center justify-center font-bold text-sm shrink-0">
          <Plus className="w-4 h-4 stroke-[3]" />
        </div>
      </div>

      {/* Meal Sections */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Today's Meals
          </h2>
          <span className="text-xs font-semibold text-zinc-500">
            {daySummary.consumed.calories} kcal logged
          </span>
        </div>

        {MEALS.map((meal) => (
          <MealSection
            key={meal.type}
            type={meal.type}
            title={meal.title}
            items={daySummary.mealLogs[meal.type]}
            onScan={openScanner}
            onSearch={openSearch}
            onDelete={deleteFoodLog}
            onDuplicate={duplicateFoodLog}
            onEdit={setEditingLogItem}
          />
        ))}
      </div>
    </div>
  );
};
