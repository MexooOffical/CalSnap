import React from 'react';
import { MealType, FoodLogItem } from '../types';
import { Plus, Camera, Search, Trash2, Copy } from 'lucide-react';

interface MealSectionProps {
  type: MealType;
  title: string;
  recommendedCalorieShare?: string;
  items: FoodLogItem[];
  onScan: (type: MealType) => void;
  onSearch: (type: MealType) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onEdit?: (item: FoodLogItem) => void;
}

export const MealSection: React.FC<MealSectionProps> = ({
  type,
  title,
  items,
  onScan,
  onSearch,
  onDelete,
  onDuplicate,
  onEdit,
}) => {
  const totalCalories = items.reduce((acc, i) => acc + i.calories, 0);

  return (
    <div
      id={`meal-section-${type}`}
      className="w-full bg-white rounded-2xl p-4 border border-zinc-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)]"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-baseline gap-2">
          <h3 className="text-base font-bold text-zinc-900 capitalize tracking-tight">{title}</h3>
          {totalCalories > 0 && (
            <span className="text-xs font-semibold text-zinc-500">
              {totalCalories} <span className="font-normal text-zinc-400">kcal</span>
            </span>
          )}
        </div>

        {/* Quick Add Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            id={`btn-search-${type}`}
            onClick={() => onSearch(type)}
            className="flex items-center gap-1 text-xs font-medium text-zinc-600 hover:text-zinc-900 bg-zinc-50 hover:bg-zinc-100 px-2.5 py-1.5 rounded-xl transition"
            title="Search Indian foods"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
          </button>
          <button
            id={`btn-scan-${type}`}
            onClick={() => onScan(type)}
            className="flex items-center gap-1 text-xs font-semibold text-zinc-900 bg-zinc-100 hover:bg-zinc-200 px-2.5 py-1.5 rounded-xl transition"
            title="Scan with AI"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Scan</span>
          </button>
        </div>
      </div>

      {/* Food Items List */}
      {items.length === 0 ? (
        <div
          onClick={() => onScan(type)}
          className="border border-dashed border-zinc-200 rounded-xl py-4 px-3 flex items-center justify-center gap-2 text-zinc-400 hover:border-zinc-300 hover:text-zinc-600 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span className="text-xs font-medium">Log {title}</span>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="group flex items-center justify-between py-2 px-2.5 rounded-xl hover:bg-zinc-50 transition border border-transparent hover:border-zinc-100"
            >
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.foodName}
                  className="w-10 h-10 rounded-lg object-cover mr-2.5 shrink-0 border border-zinc-200 shadow-xs"
                />
              )}
              <div
                className="flex-1 cursor-pointer pr-2"
                onClick={() => onEdit && onEdit(item)}
              >
                <div className="text-sm font-medium text-zinc-800 leading-snug">
                  {item.foodName}
                </div>
                <div className="text-[11px] text-zinc-400 flex items-center gap-2 mt-0.5">
                  <span>{item.servingSize}</span>
                  <span>•</span>
                  <span>P: {Math.round(item.protein)}g</span>
                  <span>C: {Math.round(item.carbs)}g</span>
                  <span>F: {Math.round(item.fat)}g</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-zinc-900">
                  {item.calories} <span className="text-[10px] font-normal text-zinc-400">kcal</span>
                </span>

                {/* Micro Action Buttons */}
                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicate(item.id);
                    }}
                    title="Duplicate meal"
                    className="p-1 hover:bg-zinc-200/60 rounded-lg text-zinc-400 hover:text-zinc-700 transition"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(item.id);
                    }}
                    title="Delete entry"
                    className="p-1 hover:bg-rose-50 rounded-lg text-zinc-400 hover:text-rose-600 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
