import React, { useState } from 'react';
import { FoodLogItem, MealType } from '../types';
import { X, Trash2, Check } from 'lucide-react';

interface EditLogModalProps {
  item: FoodLogItem | null;
  onClose: () => void;
  onSave: (id: string, updates: Partial<FoodLogItem>) => void;
  onDelete: (id: string) => void;
}

export const EditLogModal: React.FC<EditLogModalProps> = ({
  item,
  onClose,
  onSave,
  onDelete,
}) => {
  if (!item) return null;

  const [foodName, setFoodName] = useState(item.foodName);
  const [mealType, setMealType] = useState<MealType>(item.mealType);
  const [servingSize, setServingSize] = useState(item.servingSize);
  const [calories, setCalories] = useState(item.calories);
  const [protein, setProtein] = useState(item.protein);
  const [carbs, setCarbs] = useState(item.carbs);
  const [fat, setFat] = useState(item.fat);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(item.id, {
      foodName,
      mealType,
      servingSize,
      calories: Number(calories),
      protein: Number(protein),
      carbs: Number(carbs),
      fat: Number(fat),
    });
    onClose();
  };

  const handleDelete = () => {
    onDelete(item.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl border border-zinc-100 shadow-2xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
          <h3 className="text-base font-extrabold text-zinc-900">Edit Logged Meal</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-zinc-400 hover:text-zinc-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-zinc-500 uppercase block mb-1">
              Food Name
            </label>
            <input
              type="text"
              required
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-zinc-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase block mb-1">
                Meal Category
              </label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value as MealType)}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm bg-white"
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="snack">Snack</option>
                <option value="dinner">Dinner</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase block mb-1">
                Calories (kcal)
              </label>
              <input
                type="number"
                value={calories}
                onChange={(e) => setCalories(parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-sm font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[10px] font-semibold text-zinc-500 uppercase block mb-1">
                Protein (g)
              </label>
              <input
                type="number"
                step="0.1"
                value={protein}
                onChange={(e) => setProtein(parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-1.5 rounded-xl border border-zinc-200 text-xs text-center font-bold"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-zinc-500 uppercase block mb-1">
                Carbs (g)
              </label>
              <input
                type="number"
                step="0.1"
                value={carbs}
                onChange={(e) => setCarbs(parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-1.5 rounded-xl border border-zinc-200 text-xs text-center font-bold"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-zinc-500 uppercase block mb-1">
                Fats (g)
              </label>
              <input
                type="number"
                step="0.1"
                value={fat}
                onChange={(e) => setFat(parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-1.5 rounded-xl border border-zinc-200 text-xs text-center font-bold"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded-2xl text-xs flex items-center justify-center gap-1.5 transition"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-zinc-900 hover:bg-black text-white font-semibold rounded-2xl text-xs flex items-center justify-center gap-2 transition"
            >
              <Check className="w-4 h-4" />
              <span>Update Meal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
