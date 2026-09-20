import React from 'react';
import { MacroSummary } from '../types';

interface CalorieArcProps {
  consumed: MacroSummary;
  target: MacroSummary;
  remainingCalories: number;
}

export const CalorieArc: React.FC<CalorieArcProps> = ({
  consumed,
  target,
  remainingCalories,
}) => {
  const percent = target.calories > 0 ? Math.min(100, (consumed.calories / target.calories) * 100) : 0;

  // Arc calculation (260 degree arc)
  const radius = 88;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.72; // 260 degrees
  const strokeDashoffset = arcLength - (arcLength * percent) / 100;

  // Macro percentages
  const proteinPercent = target.protein > 0 ? Math.min(100, (consumed.protein / target.protein) * 100) : 0;
  const carbsPercent = target.carbs > 0 ? Math.min(100, (consumed.carbs / target.carbs) * 100) : 0;
  const fatPercent = target.fat > 0 ? Math.min(100, (consumed.fat / target.fat) * 100) : 0;

  return (
    <div id="calorie-gauge-card" className="w-full bg-white rounded-3xl p-6 border border-zinc-100 shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col items-center">
      {/* Main Circular Gauge */}
      <div className="relative w-56 h-56 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-130" viewBox="0 0 200 200">
          {/* Background Track */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="#F4F4F5"
            strokeWidth="11"
            strokeLinecap="round"
            strokeDasharray={`${arcLength} ${circumference}`}
          />
          {/* Progress Arc */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="#18181B"
            strokeWidth="11"
            strokeLinecap="round"
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Numbers */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pt-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
            Remaining
          </span>
          <div className="flex items-baseline justify-center gap-1 my-0.5">
            <span className="text-4xl font-extrabold tracking-tight text-zinc-900">
              {remainingCalories.toLocaleString()}
            </span>
            <span className="text-xs font-medium text-zinc-500">kcal</span>
          </div>
          <div className="text-[11px] text-zinc-400 font-medium flex items-center gap-1.5">
            <span>Target: {target.calories.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Consumed / Target Sub-row */}
      <div className="w-full grid grid-cols-2 gap-3 pt-2 pb-5 border-b border-zinc-100">
        <div className="text-center bg-zinc-50/80 rounded-2xl py-2.5 px-3">
          <div className="text-[11px] text-zinc-400 font-medium">Eaten</div>
          <div className="text-base font-bold text-zinc-800">
            {consumed.calories.toLocaleString()} <span className="text-xs font-normal text-zinc-400">kcal</span>
          </div>
        </div>
        <div className="text-center bg-zinc-50/80 rounded-2xl py-2.5 px-3">
          <div className="text-[11px] text-zinc-400 font-medium">Daily Goal</div>
          <div className="text-base font-bold text-zinc-800">
            {target.calories.toLocaleString()} <span className="text-xs font-normal text-zinc-400">kcal</span>
          </div>
        </div>
      </div>

      {/* Macronutrient Minimal Progress Bars */}
      <div className="w-full grid grid-cols-3 gap-3 pt-4">
        {/* Protein */}
        <div className="flex flex-col">
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-[11px] font-semibold text-zinc-500">Protein</span>
            <span className="text-[11px] font-bold text-zinc-800">
              {Math.round(consumed.protein)}/{target.protein}g
            </span>
          </div>
          <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${proteinPercent}%` }}
            />
          </div>
        </div>

        {/* Carbs */}
        <div className="flex flex-col">
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-[11px] font-semibold text-zinc-500">Carbs</span>
            <span className="text-[11px] font-bold text-zinc-800">
              {Math.round(consumed.carbs)}/{target.carbs}g
            </span>
          </div>
          <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${carbsPercent}%` }}
            />
          </div>
        </div>

        {/* Fat */}
        <div className="flex flex-col">
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-[11px] font-semibold text-zinc-500">Fats</span>
            <span className="text-[11px] font-bold text-zinc-800">
              {Math.round(consumed.fat)}/{target.fat}g
            </span>
          </div>
          <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-rose-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${fatPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
