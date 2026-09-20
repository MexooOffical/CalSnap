import React, { useState, useMemo } from 'react';
import { MealType, DatabaseFoodItem } from '../types';
import { INDIAN_FOOD_DATABASE, searchIndianFoods } from '../data/indianFoodDatabase';
import { X, Search, Plus, Check } from 'lucide-react';

interface FoodSearchModalProps {
  isOpen: boolean;
  targetMealType: MealType;
  onClose: () => void;
  onSelectFood: (entry: {
    mealType: MealType;
    foodName: string;
    servingSize: string;
    quantity: number;
    weightGrams: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
  }) => void;
}

const CATEGORIES = [
  { id: 'All', label: 'All' },
  { id: 'breakfast', label: 'Breakfast' },
  { id: 'dal', label: 'Dal & Sambars' },
  { id: 'curry', label: 'Curries & Sabzis' },
  { id: 'bread', label: 'Rotis & Breads' },
  { id: 'rice', label: 'Biryani & Rice' },
  { id: 'snack', label: 'Snacks & Chaat' },
  { id: 'sweet', label: 'Mithai' },
  { id: 'drink', label: 'Beverages' },
];

export const FoodSearchModal: React.FC<FoodSearchModalProps> = ({
  isOpen,
  targetMealType,
  onClose,
  onSelectFood,
}) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFood, setSelectedFood] = useState<DatabaseFoodItem | null>(null);
  const [servingMultiplier, setServingMultiplier] = useState(1);
  const [showCustomForm, setShowCustomForm] = useState(false);

  // Custom food state
  const [customName, setCustomName] = useState('');
  const [customServing, setCustomServing] = useState('1 plate (200g)');
  const [customCalories, setCustomCalories] = useState('250');
  const [customProtein, setCustomProtein] = useState('8');
  const [customCarbs, setCustomCarbs] = useState('35');
  const [customFat, setCustomFat] = useState('8');
  const [customFiber, setCustomFiber] = useState('4');

  const filteredFoods = useMemo(() => {
    let results: DatabaseFoodItem[] = searchIndianFoods(query);
    if (selectedCategory !== 'All') {
      results = results.filter((item: DatabaseFoodItem) => item.category === selectedCategory);
    }
    return results;
  }, [query, selectedCategory]);

  const handleLogSelectedFood = () => {
    if (!selectedFood) return;
    const factor = servingMultiplier;

    onSelectFood({
      mealType: targetMealType,
      foodName: selectedFood.name,
      servingSize:
        factor === 1
          ? selectedFood.defaultServing
          : `${factor}x (${Math.round(selectedFood.defaultServingGrams * factor)}g)`,
      quantity: factor,
      weightGrams: Math.round(selectedFood.defaultServingGrams * factor),
      calories: Math.round(selectedFood.calories * factor),
      protein: Number((selectedFood.protein * factor).toFixed(1)),
      carbs: Number((selectedFood.carbs * factor).toFixed(1)),
      fat: Number((selectedFood.fat * factor).toFixed(1)),
      fiber: selectedFood.fiber ? Number((selectedFood.fiber * factor).toFixed(1)) : 0,
    });
    onClose();
  };

  const handleLogCustomFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    onSelectFood({
      mealType: targetMealType,
      foodName: customName.trim(),
      servingSize: customServing.trim() || '1 serving',
      quantity: 1,
      weightGrams: 150,
      calories: Math.max(0, parseInt(customCalories) || 0),
      protein: Math.max(0, parseFloat(customProtein) || 0),
      carbs: Math.max(0, parseFloat(customCarbs) || 0),
      fat: Math.max(0, parseFloat(customFat) || 0),
      fiber: Math.max(0, parseFloat(customFiber) || 0),
    });
    onClose();
  };


  return (
    <div
      id="food-search-modal"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end sm:items-center sm:justify-center p-0 sm:p-4"
    >
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl border border-zinc-100 shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-zinc-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block leading-none">
              Log to {targetMealType.toUpperCase()}
            </span>
            <h2 className="text-lg font-extrabold text-zinc-900 leading-tight">
              Search Indian Foods
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar Input */}
        <div className="p-4 border-b border-zinc-100 bg-zinc-50/50">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5" />
            <input
              id="input-food-search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search poha, dosa, dal tadka, paneer..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-2xl text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 transition"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 p-1 text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Chips */}
          <div className="flex gap-1.5 overflow-x-auto pt-2.5 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === cat.id
                    ? 'bg-zinc-900 text-white'
                    : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Body: List vs Custom Form */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {showCustomForm ? (
            <form onSubmit={handleLogCustomFood} className="space-y-4 py-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-zinc-900">Custom Food Entry</span>
                <button
                  type="button"
                  onClick={() => setShowCustomForm(false)}
                  className="text-xs text-zinc-500 hover:text-zinc-900 font-medium"
                >
                  Back to Search
                </button>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-500 uppercase block mb-1">
                  Food Name
                </label>
                <input
                  type="text"
                  required
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Homemade Methi Thepla"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-500 uppercase block mb-1">
                    Serving Description
                  </label>
                  <input
                    type="text"
                    value={customServing}
                    onChange={(e) => setCustomServing(e.target.value)}
                    placeholder="e.g. 2 pieces (70g)"
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-zinc-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-500 uppercase block mb-1">
                    Calories (kcal)
                  </label>
                  <input
                    type="number"
                    required
                    value={customCalories}
                    onChange={(e) => setCustomCalories(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-sm font-bold focus:outline-none focus:border-zinc-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-zinc-500 uppercase block mb-1">
                    Protein (g)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={customProtein}
                    onChange={(e) => setCustomProtein(e.target.value)}
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
                    value={customCarbs}
                    onChange={(e) => setCustomCarbs(e.target.value)}
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
                    value={customFat}
                    onChange={(e) => setCustomFat(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-xl border border-zinc-200 text-xs text-center font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-zinc-500 uppercase block mb-1">
                    Fiber (g)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={customFiber}
                    onChange={(e) => setCustomFiber(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-xl border border-zinc-200 text-xs text-center font-bold"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-zinc-900 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 mt-4"
              >
                <Plus className="w-4 h-4" />
                <span>Save &amp; Log to {targetMealType}</span>
              </button>
            </form>
          ) : (
            <>
              {/* Add Custom Button Banner */}
              <div
                onClick={() => setShowCustomForm(true)}
                className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 hover:bg-zinc-100 border border-dashed border-zinc-300 cursor-pointer transition"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-zinc-200 flex items-center justify-center text-zinc-700">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-800">Can't find your dish?</div>
                    <div className="text-[10px] text-zinc-500">
                      Create a custom meal with your recipe macros
                    </div>
                  </div>
                </div>
                <span className="text-xs font-semibold text-zinc-700">Add Custom</span>
              </div>

              {/* Database Results */}
              {filteredFoods.length === 0 ? (
                <div className="text-center py-8 text-zinc-400 text-xs">
                  No matches for "{query}". Try another spelling or add as custom food.
                </div>
              ) : (
                filteredFoods.map((item: DatabaseFoodItem) => {
                  const isSelected = selectedFood?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedFood(item)}
                      className={`p-3 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                        isSelected
                          ? 'bg-zinc-900 border-zinc-900 text-white shadow-sm'
                          : 'bg-white border-zinc-100 hover:border-zinc-200 text-zinc-900'
                      }`}
                    >
                      <div className="pr-3">
                        <div className="text-sm font-bold leading-snug">{item.name}</div>
                        <div
                          className={`text-[11px] flex items-center gap-2 mt-0.5 ${
                            isSelected ? 'text-zinc-300' : 'text-zinc-400'
                          }`}
                        >
                          <span>{item.defaultServing}</span>
                          <span>•</span>
                          <span>P: {item.protein}g</span>
                          <span>C: {item.carbs}g</span>
                          <span>F: {item.fat}g</span>
                        </div>
                        <div
                          className={`text-[10px] mt-0.5 ${
                            isSelected ? 'text-zinc-400' : 'text-zinc-400'
                          }`}
                        >
                          {item.regionalOrigin}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-sm font-extrabold">{item.calories}</div>
                        <div
                          className={`text-[10px] ${
                            isSelected ? 'text-zinc-400' : 'text-zinc-400'
                          }`}
                        >
                          kcal
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </>
          )}
        </div>

        {/* Selected Food Action Bottom Bar */}
        {selectedFood && !showCustomForm && (
          <div className="p-4 bg-zinc-50 border-t border-zinc-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs">
                <span className="font-bold text-zinc-900">{selectedFood.name}</span>
                <span className="text-zinc-500 ml-1">
                  ({Math.round(selectedFood.calories * servingMultiplier)} kcal)
                </span>
              </div>

              {/* Multiplier buttons */}
              <div className="flex items-center gap-1.5">
                {[0.5, 1.0, 1.5, 2.0].map((m) => (
                  <button
                    key={m}
                    onClick={() => setServingMultiplier(m)}
                    className={`px-2 py-0.5 rounded-lg text-xs font-bold transition ${
                      servingMultiplier === m
                        ? 'bg-zinc-900 text-white'
                        : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                    }`}
                  >
                    {m}x
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleLogSelectedFood}
              className="w-full py-3 bg-zinc-900 hover:bg-black text-white font-semibold rounded-2xl text-xs flex items-center justify-center gap-2 transition"
            >
              <Check className="w-4 h-4" />
              <span>
                Add {servingMultiplier}x to {targetMealType.toUpperCase()}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
