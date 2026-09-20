import React from 'react';
import { useApp } from '../context/AppContext';
import { MealSection } from './MealSection';
import { MealType } from '../types';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Sparkles } from 'lucide-react';

export const DiaryView: React.FC = () => {
  const {
    selectedDate,
    setSelectedDate,
    getDaySummary,
    deleteFoodLog,
    duplicateFoodLog,
    openScanner,
    openSearch,
    setEditingLogItem,
  } = useApp();

  const daySummary = getDaySummary(selectedDate);

  // Date navigation helpers
  const handleShiftDate = (days: number) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + days);
    const yyyy = current.getFullYear();
    const mm = String(current.getMonth() + 1).padStart(2, '0');
    const dd = String(current.getDate()).padStart(2, '0');
    setSelectedDate(`${yyyy}-${mm}-${dd}`);
  };

  const isToday = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return selectedDate === `${yyyy}-${mm}-${dd}`;
  };

  const formatDateDisplay = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  const MEALS: { type: MealType; title: string }[] = [
    { type: 'breakfast', title: 'Breakfast' },
    { type: 'lunch', title: 'Lunch' },
    { type: 'snack', title: 'Snacks & Beverages' },
    { type: 'dinner', title: 'Dinner' },
  ];

  return (
    <div id="diary-view" className="w-full pb-28 pt-2 space-y-4">
      {/* Date Header Strip */}
      <div className="bg-white rounded-2xl p-3 border border-zinc-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center justify-between">
        <button
          onClick={() => handleShiftDate(-1)}
          className="p-1.5 rounded-xl text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition"
          title="Previous day"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-zinc-400" />
          <span className="text-sm font-bold text-zinc-900">
            {formatDateDisplay(selectedDate)}
          </span>
          {isToday() && (
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-zinc-900 text-white">
              Today
            </span>
          )}
        </div>

        <button
          onClick={() => handleShiftDate(1)}
          className="p-1.5 rounded-xl text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition"
          title="Next day"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Day Overview Compact Bar */}
      <div className="bg-white rounded-2xl p-4 border border-zinc-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="flex justify-between items-baseline mb-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
              Daily Energy
            </span>
            <span className="text-2xl font-extrabold text-zinc-900 tracking-tight">
              {daySummary.consumed.calories}{' '}
              <span className="text-sm font-medium text-zinc-400">
                / {daySummary.target.calories} kcal
              </span>
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-zinc-500">
              {daySummary.remainingCalories} kcal left
            </span>
          </div>
        </div>

        {/* Linear progress bar */}
        <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden mb-3">
          <div
            className="bg-zinc-900 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, daySummary.adherencePercent)}%` }}
          />
        </div>

        {/* Macro quick badges */}
        <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-zinc-50 text-xs">
          <div>
            <span className="text-zinc-400 font-medium">Protein: </span>
            <span className="font-bold text-zinc-800">
              {Math.round(daySummary.consumed.protein)}/{daySummary.target.protein}g
            </span>
          </div>
          <div>
            <span className="text-zinc-400 font-medium">Carbs: </span>
            <span className="font-bold text-zinc-800">
              {Math.round(daySummary.consumed.carbs)}/{daySummary.target.carbs}g
            </span>
          </div>
          <div>
            <span className="text-zinc-400 font-medium">Fat: </span>
            <span className="font-bold text-zinc-800">
              {Math.round(daySummary.consumed.fat)}/{daySummary.target.fat}g
            </span>
          </div>
        </div>
      </div>

      {/* Meal Sections */}
      <div className="space-y-3">
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
