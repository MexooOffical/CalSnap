import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Flame, Trash2, Plus, Sparkles } from 'lucide-react';
import { FoodLogItem } from '../types';

export const CalAiHomeView: React.FC = () => {
  const {
    userProfile,
    selectedDate,
    setSelectedDate,
    getDaySummary,
    foodLogs,
    openScanner,
    deleteFoodLog,
  } = useApp();

  const [activeCarouselDot, setActiveCarouselDot] = useState<0 | 1>(0);

  const daySummary = getDaySummary(selectedDate);

  // Today's logs
  const todayLogs = foodLogs.filter((item) => item.date === selectedDate);

  // Remaining values (matching Cal AI style)
  const caloriesLeft = Math.max(0, daySummary.remainingCalories);
  const proteinLeft = Math.max(0, Math.round(daySummary.target.protein - daySummary.consumed.protein));
  const carbsLeft = Math.max(0, Math.round(daySummary.target.carbs - daySummary.consumed.carbs));
  const fatLeft = Math.max(0, Math.round(daySummary.target.fat - daySummary.consumed.fat));

  // Circular progress calculations
  const caloriePercent = Math.min(100, Math.round((daySummary.consumed.calories / (daySummary.target.calories || 1)) * 100));
  const proteinPercent = Math.min(100, Math.round((daySummary.consumed.protein / (daySummary.target.protein || 1)) * 100));
  const carbsPercent = Math.min(100, Math.round((daySummary.consumed.carbs / (daySummary.target.carbs || 1)) * 100));
  const fatPercent = Math.min(100, Math.round((daySummary.consumed.fat / (daySummary.target.fat || 1)) * 100));

  // Week days matching screenshot: S S M T W T F with dates 1 2 3 4 5 6 7
  // Day 6 (T 6) is the active highlighted day with thick black dashed circle and bold 6!
  // Day 7 (F 7) has no circle and faint text because it is in the future.
  const [activeDayIndex, setActiveDayIndex] = useState<number>(5); // Index 5 = Thursday 6th (matching screenshot)

  const weekSchedule = [
    { letter: 'S', dayNumber: 1, status: 'past' },
    { letter: 'S', dayNumber: 2, status: 'past' },
    { letter: 'M', dayNumber: 3, status: 'past' },
    { letter: 'T', dayNumber: 4, status: 'past' },
    { letter: 'W', dayNumber: 5, status: 'past' },
    { letter: 'T', dayNumber: 6, status: 'today' },
    { letter: 'F', dayNumber: 7, status: 'future' },
  ];

  return (
    <div id="cal-ai-home" className="w-full pb-28 pt-1 space-y-3 select-none">
      {/* Top Header: Apple logo + Cal AI and Flame streak badge */}
      <div className="flex items-center justify-between px-0.5 pt-0.5">
        <div className="flex items-center gap-2">
          {/* Filled Apple Icon */}
          <svg className="w-5 h-5 fill-black" viewBox="0 0 170 170">
            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.08-7.77-7.98-12.24-14.7-5.99-8.99-10.75-19.44-14.28-31.35-3.53-11.91-5.3-23.47-5.3-34.69 0-14.24 3.73-26.11 11.19-35.61 7.46-9.5 16.92-14.35 28.38-14.56 5.56 0 11.29 1.41 17.2 4.23 5.91 2.82 10.12 4.34 12.63 4.56 2.18-.33 6.64-1.96 13.38-4.89 6.74-2.93 12.83-4.29 18.27-4.08 13.59.65 24.36 5.76 32.31 15.33-11.96 7.29-17.83 17.29-17.62 30 0 10.22 3.91 18.92 11.74 26.09 7.83 7.18 17.29 11.09 28.38 11.74-2.17 6.74-4.78 13.37-7.83 19.89zM119.22 31.84c0-7.72 2.72-14.9 8.16-21.53 5.44-6.63 12.18-10.55 20.22-11.74.22 1.09.33 2.07.33 2.94 0 7.61-2.83 14.89-8.48 21.85-5.65 6.96-12.61 10.87-20.87 11.74-.22-1.09-.33-2.18-.33-3.26z" />
          </svg>
          <h1 className="text-[22px] font-bold text-black tracking-tight font-sans">
            Cal AI
          </h1>
        </div>

        {/* Streak Flame Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-black/[0.04] shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
          <span className="text-sm leading-none">🔥</span>
          <span className="text-xs font-semibold text-zinc-900">0</span>
        </div>
      </div>

      {/* Week Day Selector: S S M T W T F with exact styling from screenshot */}
      <div className="flex items-center justify-between px-1.5 pt-0.5 pb-0.5">
        {weekSchedule.map((item, idx) => {
          const isCurrentActive = idx === activeDayIndex;
          const isFuture = idx > activeDayIndex;

          return (
            <div
              key={idx}
              onClick={() => setActiveDayIndex(idx)}
              className="flex flex-col items-center gap-1.5 cursor-pointer transition active:scale-95 select-none"
            >
              {/* Circular container for Day letter */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] transition ${
                  isCurrentActive
                    ? 'border-[1.5px] border-dashed border-black text-black font-semibold'
                    : isFuture
                    ? 'border-0 text-zinc-300 font-normal'
                    : 'border-[1.2px] border-dashed border-zinc-300 text-zinc-600 font-normal'
                }`}
              >
                {item.letter}
              </div>

              {/* Date Number below */}
              <span
                className={`text-[11px] transition ${
                  isCurrentActive
                    ? 'font-bold text-black'
                    : isFuture
                    ? 'font-normal text-zinc-300'
                    : 'font-normal text-zinc-600'
                }`}
              >
                {item.dayNumber}
              </span>
            </div>
          );
        })}
      </div>

      {/* Primary Card: 1000 Calories left + Circular Ring Gauge */}
      <div
        id="card-calories-left"
        className="w-full bg-white rounded-[24px] px-5 py-4 shadow-[0_2px_14px_rgba(0,0,0,0.02)] border border-black/[0.03] flex items-center justify-between min-h-[125px]"
      >
        <div>
          <div className="text-[40px] font-bold text-black leading-none tracking-tight">
            {caloriesLeft}
          </div>
          <div className="text-xs font-normal text-zinc-400 mt-1.5 tracking-tight">
            Calories left
          </div>
        </div>

        {/* Circular Ring Gauge with Flame Icon */}
        <div className="relative w-[72px] h-[72px] flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 72 72">
            {/* Background Soft Gray Track */}
            <circle
              cx="36"
              cy="36"
              r="29"
              fill="transparent"
              stroke="#f0f0f5"
              strokeWidth="7"
            />
            {/* Progress Stroke if meals logged */}
            {caloriePercent > 0 && (
              <circle
                cx="36"
                cy="36"
                r="29"
                fill="transparent"
                stroke="#18181b"
                strokeWidth="7"
                strokeDasharray={182}
                strokeDashoffset={182 - (182 * caloriePercent) / 100}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            )}
          </svg>

          {/* Center Circle with Flame Icon */}
          <div className="absolute inset-0 m-auto w-9 h-9 rounded-full bg-[#f8f8fb] flex items-center justify-center">
            <Flame className="w-4 h-4 fill-black text-black" />
          </div>
        </div>
      </div>

      {/* Three Macro Cards Row: Protein, Carbs, Fat */}
      <div className="grid grid-cols-3 gap-2">
        {/* Protein Card */}
        <div className="bg-white rounded-[20px] pt-3.5 pb-3 px-3 shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-black/[0.03] flex flex-col items-start justify-between min-h-[130px]">
          <div>
            <div className="text-[17px] font-bold text-black leading-tight tracking-tight">
              {proteinLeft}g
            </div>
            <div className="text-[11px] font-normal text-zinc-400 mt-0.5">
              Protein left
            </div>
          </div>

          <div className="w-full flex justify-center pt-2 pb-0.5">
            <div className="relative w-11 h-11 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 44 44">
                <circle
                  cx="22"
                  cy="22"
                  r="17"
                  fill="transparent"
                  stroke="#f0f0f6"
                  strokeWidth="3.8"
                />
                {proteinPercent > 0 && (
                  <circle
                    cx="22"
                    cy="22"
                    r="17"
                    fill="transparent"
                    stroke="#e65c5c"
                    strokeWidth="3.8"
                    strokeDasharray={107}
                    strokeDashoffset={107 - (107 * proteinPercent) / 100}
                    strokeLinecap="round"
                  />
                )}
              </svg>
              {/* Chicken drumstick icon (coral/red) */}
              <div className="absolute inset-0 m-auto w-7 h-7 rounded-full bg-[#fcfcff] flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-[#e65c5c] fill-current" viewBox="0 0 24 24">
                  <path d="M19.5 4.5c-2.3-2.3-6.1-2-7.9.6l-1.3 1.9c-.3.4-.8.7-1.3.8l-1.8.4c-1.1.2-1.9 1-2.1 2.1-.2 1-.8 1.9-1.6 2.5l-.8.6c-1.1.8-1.5 2.2-1 3.5.5 1.3 1.9 2.1 3.3 1.9.9-.1 1.8.2 2.5.8l.6.6c.8.8 2 1.1 3.1.8 1.1-.3 1.9-1.1 2.1-2.1l.4-1.8c.1-.5.4-1 .8-1.3l1.9-1.3c2.6-1.8 2.9-5.6.6-7.9zM5.5 19.5c-.8.8-2.2.8-3 0s-.8-2.2 0-3l1-1 3 3-1 1z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Carbs Card */}
        <div className="bg-white rounded-[20px] pt-3.5 pb-3 px-3 shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-black/[0.03] flex flex-col items-start justify-between min-h-[130px]">
          <div>
            <div className="text-[17px] font-bold text-black leading-tight tracking-tight">
              {carbsLeft}g
            </div>
            <div className="text-[11px] font-normal text-zinc-400 mt-0.5">
              Carbs left
            </div>
          </div>

          <div className="w-full flex justify-center pt-2 pb-0.5">
            <div className="relative w-11 h-11 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 44 44">
                <circle
                  cx="22"
                  cy="22"
                  r="17"
                  fill="transparent"
                  stroke="#f0f0f6"
                  strokeWidth="3.8"
                />
                {carbsPercent > 0 && (
                  <circle
                    cx="22"
                    cy="22"
                    r="17"
                    fill="transparent"
                    stroke="#d97706"
                    strokeWidth="3.8"
                    strokeDasharray={107}
                    strokeDashoffset={107 - (107 * carbsPercent) / 100}
                    strokeLinecap="round"
                  />
                )}
              </svg>
              {/* Wheat sheaf icon (golden amber) */}
              <div className="absolute inset-0 m-auto w-7 h-7 rounded-full bg-[#fcfcff] flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-[#d97706] fill-current" viewBox="0 0 24 24">
                  <path d="M6 18c1.5-1.5 3-3 4.5-4.5M10.5 13.5c.8-.8 1.8-1.2 2.8-.8.9.4 1.4 1.4 1 2.3-.4.9-1.4 1.4-2.3 1-.8-.4-1.2-1.4-.8-2.3zm2-2c.8-.8 1.8-1.2 2.8-.8.9.4 1.4 1.4 1 2.3-.4.9-1.4 1.4-2.3 1-.8-.4-1.2-1.4-.8-2.3zm2-2c.8-.8 1.8-1.2 2.8-.8.9.4 1.4 1.4 1 2.3-.4.9-1.4 1.4-2.3 1-.8-.4-1.2-1.4-.8-2.3zm-6 2c-.8.8-1.8 1.2-2.8.8-.9-.4-1.4-1.4-1-2.3.4-.9 1.4-1.4 2.3-1 .8.4 1.2 1.4.8 2.3zm2-2c-.8.8-1.8 1.2-2.8.8-.9-.4-1.4-1.4-1-2.3.4-.9 1.4-1.4 2.3-1 .8.4 1.2 1.4.8 2.3zm4-4l2-2" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Fat Card */}
        <div className="bg-white rounded-[20px] pt-3.5 pb-3 px-3 shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-black/[0.03] flex flex-col items-start justify-between min-h-[130px]">
          <div>
            <div className="text-[17px] font-bold text-black leading-tight tracking-tight">
              {fatLeft}g
            </div>
            <div className="text-[11px] font-normal text-zinc-400 mt-0.5">
              Fat left
            </div>
          </div>

          <div className="w-full flex justify-center pt-2 pb-0.5">
            <div className="relative w-11 h-11 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 44 44">
                <circle
                  cx="22"
                  cy="22"
                  r="17"
                  fill="transparent"
                  stroke="#f0f0f6"
                  strokeWidth="3.8"
                />
                {fatPercent > 0 && (
                  <circle
                    cx="22"
                    cy="22"
                    r="17"
                    fill="transparent"
                    stroke="#4361ee"
                    strokeWidth="3.8"
                    strokeDasharray={107}
                    strokeDashoffset={107 - (107 * fatPercent) / 100}
                    strokeLinecap="round"
                  />
                )}
              </svg>
              {/* Avocado icon (slate blue/periwinkle #4361ee) */}
              <div className="absolute inset-0 m-auto w-7 h-7 rounded-full bg-[#fcfcff] flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-[#4361ee] fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C8 2 5 7 5 13c0 4.4 3.1 8 7 8s7-3.6 7-8c0-6-3-11-7-11zm0 15a4 4 0 110-8 4 4 0 010 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Pagination Dots */}
      <div className="flex justify-center items-center gap-1.5 py-0.5">
        <div
          onClick={() => setActiveCarouselDot(0)}
          className={`w-[6px] h-[6px] rounded-full transition-all cursor-pointer ${
            activeCarouselDot === 0 ? 'bg-black' : 'bg-zinc-300'
          }`}
        />
        <div
          onClick={() => setActiveCarouselDot(1)}
          className={`w-[6px] h-[6px] rounded-full transition-all cursor-pointer ${
            activeCarouselDot === 1 ? 'bg-black' : 'border border-zinc-300 bg-transparent'
          }`}
        />
      </div>

      {/* Recently Logged Section */}
      <div className="space-y-2.5 pt-0.5">
        <h2 className="text-[17px] font-bold text-black tracking-tight px-0.5">
          Recently logged
        </h2>

        {/* Empty State Card (Exact replica from Cal AI screenshot) */}
        {todayLogs.length === 0 ? (
          <div
            id="empty-recently-logged"
            onClick={() => openScanner()}
            className="w-full bg-white rounded-[22px] px-5 py-5 shadow-[0_2px_14px_rgba(0,0,0,0.02)] border border-black/[0.03] relative text-center cursor-pointer transition active:scale-[0.99] group min-h-[110px] flex flex-col justify-center"
          >
            <h3 className="text-[14px] font-semibold text-black mb-1 tracking-tight">
              You haven't uploaded any food
            </h3>
            <p className="text-[12px] font-normal text-zinc-400 leading-snug max-w-[240px] mx-auto">
              Start tracking today's meals by taking a quick picture.
            </p>

            {/* Exact Hand-Drawn Doodle Ribbon Loop Arrow pointing to bottom-right + button */}
            <svg
              className="w-10 h-14 text-black absolute right-5 -bottom-4 pointer-events-none group-hover:scale-105 transition-transform"
              viewBox="0 0 52 70"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Downward stem, loop knot, and swooping exit down-left */}
              <path d="M 24 4 C 24 16 23 23 23 31 C 23 40 45 38 43 26 C 41 16 20 22 24 40 C 27 50 30 57 27 63" />
              <path d="M 21 56 L 27 63 L 33 55" />
            </svg>
          </div>
        ) : (
          /* Food logs list if any meals have been uploaded */
          <div className="space-y-2.5">
            {todayLogs.map((item: FoodLogItem) => (
              <div
                key={item.id}
                className="w-full bg-white rounded-2xl p-3.5 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center justify-between hover:border-zinc-300 transition"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* Photo thumbnail if uploaded */}
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.foodName}
                      className="w-12 h-12 rounded-xl object-cover border border-zinc-200/80 shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center text-lg shrink-0">
                      🥗
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-zinc-900 truncate">
                      {item.foodName}
                    </div>
                    <div className="text-[11px] text-zinc-400 flex items-center gap-2 mt-0.5 font-medium">
                      <span>{item.servingSize}</span>
                      <span>•</span>
                      <span>P: {Math.round(item.protein)}g</span>
                      <span>C: {Math.round(item.carbs)}g</span>
                      <span>F: {Math.round(item.fat)}g</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <div className="text-right">
                    <div className="text-sm font-black text-black">
                      {item.calories} <span className="text-[10px] font-normal text-zinc-400">kcal</span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFoodLog(item.id);
                    }}
                    className="p-1.5 text-zinc-300 hover:text-red-500 rounded-lg transition"
                    title="Delete item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Quick button to add another meal */}
            <button
              onClick={() => openScanner()}
              className="w-full py-3 rounded-2xl bg-zinc-100/80 hover:bg-zinc-200/80 text-xs font-bold text-zinc-800 flex items-center justify-center gap-1.5 transition active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Log another meal</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
