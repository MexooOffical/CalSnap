import React from 'react';
import { useApp } from '../context/AppContext';
import { Flame, TrendingUp, Calendar, CheckCircle2 } from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { userProfile, foodLogs, getDaySummary, selectedDate } = useApp();
  const todaySummary = getDaySummary(selectedDate);

  // Past 7 days adherence data
  const days = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const dummyCalorieHistory = [950, 1020, 980, 1040, 990, todaySummary.consumed.calories || 0, 0];

  return (
    <div id="analytics-view" className="w-full pb-36 pt-1 space-y-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-1 pt-1">
        <h1 className="text-2xl font-black text-zinc-950 tracking-tight">
          Analytics
        </h1>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-zinc-200/70 shadow-xs">
          <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span className="text-xs font-bold text-zinc-800">Streak: 0 days</span>
        </div>
      </div>

      {/* Calorie Intake Chart Card */}
      <div className="bg-white rounded-[28px] p-5 border border-zinc-100/80 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-semibold text-zinc-400 block uppercase tracking-wider">
              Calorie Intake
            </span>
            <div className="text-xl font-black text-zinc-950 mt-0.5">
              {todaySummary.consumed.calories} <span className="text-xs font-normal text-zinc-400">/ {userProfile.dailyCalories} kcal</span>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 bg-zinc-100 rounded-lg text-zinc-700">
            This Week
          </span>
        </div>

        {/* Bar Chart Visualization */}
        <div className="flex items-end justify-between h-36 pt-4 px-2">
          {days.map((day, idx) => {
            const val = dummyCalorieHistory[idx];
            const heightPercent = Math.min(100, Math.max(12, Math.round((val / (userProfile.dailyCalories || 1000)) * 100)));
            const isToday = idx === 5; // Thursday / current

            return (
              <div key={day} className="flex flex-col items-center gap-2 flex-1">
                <div className="w-full flex justify-center items-end h-28">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-6 sm:w-7 rounded-t-xl transition-all duration-500 ${
                      isToday
                        ? 'bg-zinc-950'
                        : val > 0
                        ? 'bg-zinc-200 hover:bg-zinc-300'
                        : 'bg-zinc-100'
                    }`}
                  />
                </div>
                <span className={`text-[11px] ${isToday ? 'font-black text-zinc-950' : 'font-medium text-zinc-400'}`}>
                  {day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Macronutrient Balance Card */}
      <div className="bg-white rounded-[28px] p-5 border border-zinc-100/80 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-4">
        <h3 className="text-sm font-bold text-zinc-950">
          Macronutrient Target
        </h3>

        <div className="space-y-3">
          {/* Protein */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-zinc-600">Protein</span>
              <span className="text-zinc-950 font-bold">
                {Math.round(todaySummary.consumed.protein)}g / {userProfile.proteinTarget}g
              </span>
            </div>
            <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
              <div
                style={{ width: `${Math.min(100, (todaySummary.consumed.protein / (userProfile.proteinTarget || 1)) * 100)}%` }}
                className="h-full bg-red-500 rounded-full transition-all"
              />
            </div>
          </div>

          {/* Carbs */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-zinc-600">Carbs</span>
              <span className="text-zinc-950 font-bold">
                {Math.round(todaySummary.consumed.carbs)}g / {userProfile.carbTarget}g
              </span>
            </div>
            <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
              <div
                style={{ width: `${Math.min(100, (todaySummary.consumed.carbs / (userProfile.carbTarget || 1)) * 100)}%` }}
                className="h-full bg-amber-500 rounded-full transition-all"
              />
            </div>
          </div>

          {/* Fat */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-zinc-600">Fat</span>
              <span className="text-zinc-950 font-bold">
                {Math.round(todaySummary.consumed.fat)}g / {userProfile.fatTarget}g
              </span>
            </div>
            <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
              <div
                style={{ width: `${Math.min(100, (todaySummary.consumed.fat / (userProfile.fatTarget || 1)) * 100)}%` }}
                className="h-full bg-blue-500 rounded-full transition-all"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
