import React, { useState } from 'react';
import {
  AIAnalysisResult,
  MealType,
  FoodItemComponent,
} from '../types';
import { scaleNutrition } from '../services/aiFoodService';
import {
  X,
  Check,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Pencil,
  ChevronRight,
  Plus,
  Trash2,
} from 'lucide-react';

interface AIResultModalProps {
  isOpen: boolean;
  result: AIAnalysisResult | null;
  defaultMealType: MealType;
  onClose: () => void;
  onAddToDiary: (data: {
    mealType: MealType;
    mealTitle: string;
    servingSize: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    weightGrams: number;
    components: FoodItemComponent[];
    imageUrl?: string;
  }) => void;
  onScanAgain: () => void;
}

export const AIResultModal: React.FC<AIResultModalProps> = ({
  isOpen,
  result,
  defaultMealType,
  onClose,
  onAddToDiary,
  onScanAgain,
}) => {
  if (!isOpen || !result) return null;

  const [currentResult, setCurrentResult] = useState<AIAnalysisResult>(result);
  const [portionFactor, setPortionFactor] = useState<number>(1.0);
  const [selectedMealType, setSelectedMealType] = useState<MealType>(defaultMealType);
  const [isConfirmedAccurate, setIsConfirmedAccurate] = useState<boolean>(!result.isUncertain);
  const [isEditingItems, setIsEditingItems] = useState(false);
  const [customTitle, setCustomTitle] = useState(result.mealTitle);

  // Sync state if result changes
  React.useEffect(() => {
    setCurrentResult(result);
    setCustomTitle(result.mealTitle);
    setPortionFactor(1.0);
    setIsConfirmedAccurate(!result.isUncertain);
    setIsEditingItems(false);
  }, [result]);

  const handlePortionChange = (factor: number) => {
    setPortionFactor(factor);
    const scaled = scaleNutrition(result, factor);
    setCurrentResult(scaled);
  };

  const handleSelectAlternative = (altName: string) => {
    setCustomTitle(altName);
    setCurrentResult((prev) => ({
      ...prev,
      mealTitle: altName,
    }));
    setIsConfirmedAccurate(true);
  };

  const handleSaveToDiary = () => {
    const totalGrams = currentResult.foodItems.reduce(
      (acc, curr) => acc + curr.estimatedWeightGrams,
      0
    );

    onAddToDiary({
      mealType: selectedMealType,
      mealTitle: customTitle || currentResult.mealTitle,
      servingSize:
        portionFactor === 1
          ? 'Regular portion'
          : portionFactor === 0.75
          ? 'Small portion'
          : portionFactor === 1.35
          ? 'Large portion'
          : `${portionFactor}x serving`,
      calories: currentResult.totalCalories,
      protein: currentResult.totalProtein,
      carbs: currentResult.totalCarbs,
      fat: currentResult.totalFat,
      fiber: currentResult.totalFiber,
      weightGrams: totalGrams,
      components: currentResult.foodItems,
      imageUrl: currentResult.imageUrl,
    });
  };

  const handleUpdateItemGram = (index: number, newGrams: number) => {
    const updatedItems = [...currentResult.foodItems];
    const item = updatedItems[index];
    const ratio = newGrams > 0 && item.estimatedWeightGrams > 0 ? newGrams / item.estimatedWeightGrams : 1;

    updatedItems[index] = {
      ...item,
      estimatedWeightGrams: newGrams,
      calories: Math.round(item.calories * ratio),
      proteinGrams: Number((item.proteinGrams * ratio).toFixed(1)),
      carbsGrams: Number((item.carbsGrams * ratio).toFixed(1)),
      fatGrams: Number((item.fatGrams * ratio).toFixed(1)),
      fiberGrams: item.fiberGrams ? Number((item.fiberGrams * ratio).toFixed(1)) : undefined,
    };

    const totalCalories = updatedItems.reduce((acc, curr) => acc + curr.calories, 0);
    const totalProtein = Number(
      updatedItems.reduce((acc, curr) => acc + curr.proteinGrams, 0).toFixed(1)
    );
    const totalCarbs = Number(
      updatedItems.reduce((acc, curr) => acc + curr.carbsGrams, 0).toFixed(1)
    );
    const totalFat = Number(
      updatedItems.reduce((acc, curr) => acc + curr.fatGrams, 0).toFixed(1)
    );
    const totalFiber = Number(
      updatedItems.reduce((acc, curr) => acc + (curr.fiberGrams || 0), 0).toFixed(1)
    );

    setCurrentResult({
      ...currentResult,
      foodItems: updatedItems,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      totalFiber,
    });
  };

  const handleRemoveComponent = (index: number) => {
    if (currentResult.foodItems.length <= 1) return;
    const updatedItems = currentResult.foodItems.filter((_, idx) => idx !== index);
    const totalCalories = updatedItems.reduce((acc, curr) => acc + curr.calories, 0);
    const totalProtein = Number(
      updatedItems.reduce((acc, curr) => acc + curr.proteinGrams, 0).toFixed(1)
    );
    const totalCarbs = Number(
      updatedItems.reduce((acc, curr) => acc + curr.carbsGrams, 0).toFixed(1)
    );
    const totalFat = Number(
      updatedItems.reduce((acc, curr) => acc + curr.fatGrams, 0).toFixed(1)
    );
    const totalFiber = Number(
      updatedItems.reduce((acc, curr) => acc + (curr.fiberGrams || 0), 0).toFixed(1)
    );

    setCurrentResult({
      ...currentResult,
      foodItems: updatedItems,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      totalFiber,
    });
  };

  return (
    <div
      id="ai-result-modal"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end sm:items-center sm:justify-center p-0 sm:p-4 overflow-y-auto"
    >
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl border border-zinc-100 shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-zinc-900 text-white flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block leading-none">
                AI Recognition
              </span>
              <span className="text-sm font-extrabold text-zinc-900 leading-tight">
                {Math.round(currentResult.confidence * 100)}% Confidence
              </span>
            </div>
          </div>

          <button
            id="btn-close-result"
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Photo of what the user is eating */}
          {currentResult.imageUrl && (
            <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-zinc-200/80 shadow-sm bg-zinc-950">
              <img
                src={currentResult.imageUrl}
                alt={currentResult.mealTitle}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />
              <div className="absolute top-3 left-3">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-medium text-white border border-white/20">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Aahar AI Vision</span>
                </div>
              </div>
              <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white">
                <span className="text-xs font-semibold text-zinc-200 truncate pr-2">
                  Captured Meal
                </span>
                <span className="shrink-0 px-2 py-0.5 rounded-md bg-white/25 backdrop-blur-md text-[11px] font-bold text-white border border-white/30">
                  {currentResult.totalCalories} kcal
                </span>
              </div>
            </div>
          )}

          {/* AI Accuracy / Uncertainty Confirmation (Section 10 Requirement) */}
          {!isConfirmedAccurate && (
            <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200/80 text-amber-950">
              <div className="flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="text-xs font-bold">
                    Identified as "{currentResult.mealTitle}"
                  </div>
                  <div className="text-[11px] text-amber-800 mt-0.5">
                    Indian dishes can be visually similar. Is this correct?
                  </div>

                  <div className="flex items-center gap-2 mt-2.5">
                    <button
                      onClick={() => setIsConfirmedAccurate(true)}
                      className="px-3 py-1 bg-amber-900 text-white text-xs font-semibold rounded-lg hover:bg-amber-950 transition flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" />
                      <span>Correct</span>
                    </button>

                    {currentResult.alternatives && currentResult.alternatives.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 items-center">
                        <span className="text-[10px] text-amber-700">or:</span>
                        {currentResult.alternatives.map((alt, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSelectAlternative(alt)}
                            className="px-2 py-0.5 bg-white border border-amber-300 text-amber-900 text-[11px] font-medium rounded-lg hover:bg-amber-100 transition"
                          >
                            {alt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Meal Title & Calorie Banner */}
          <div>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                  Your Meal
                </span>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="text-xl font-extrabold text-zinc-900 tracking-tight w-full bg-transparent border-b border-transparent hover:border-zinc-200 focus:border-zinc-900 focus:outline-none transition py-0.5"
                />
              </div>

              <div className="text-right shrink-0">
                <div className="text-3xl font-extrabold text-zinc-900 tracking-tight">
                  {currentResult.totalCalories}
                </div>
                <div className="text-[11px] font-medium text-zinc-400">kcal total</div>
              </div>
            </div>

            {/* Macro Summary Grid */}
            <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-zinc-100 text-center">
              <div className="bg-zinc-50 rounded-xl py-2 px-1">
                <div className="text-[10px] font-semibold text-zinc-400 uppercase">Protein</div>
                <div className="text-sm font-bold text-zinc-800">
                  {currentResult.totalProtein}g
                </div>
              </div>
              <div className="bg-zinc-50 rounded-xl py-2 px-1">
                <div className="text-[10px] font-semibold text-zinc-400 uppercase">Carbs</div>
                <div className="text-sm font-bold text-zinc-800">
                  {currentResult.totalCarbs}g
                </div>
              </div>
              <div className="bg-zinc-50 rounded-xl py-2 px-1">
                <div className="text-[10px] font-semibold text-zinc-400 uppercase">Fats</div>
                <div className="text-sm font-bold text-zinc-800">
                  {currentResult.totalFat}g
                </div>
              </div>
              <div className="bg-zinc-50 rounded-xl py-2 px-1">
                <div className="text-[10px] font-semibold text-zinc-400 uppercase">Fiber</div>
                <div className="text-sm font-bold text-zinc-800">
                  {currentResult.totalFiber}g
                </div>
              </div>
            </div>
          </div>

          {/* Portion Controls (Section 4 Requirement) */}
          <div className="bg-zinc-50/90 rounded-2xl p-3.5 border border-zinc-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-zinc-700">Portion Size</span>
              <span className="text-xs font-semibold text-zinc-500">
                {portionFactor === 0.75
                  ? 'Small'
                  : portionFactor === 1
                  ? 'Regular (Standard)'
                  : portionFactor === 1.35
                  ? 'Large'
                  : `${portionFactor}x`}
              </span>
            </div>

            {/* Size Buttons */}
            <div className="grid grid-cols-4 gap-2 mb-2">
              {[
                { label: 'Small', factor: 0.75 },
                { label: 'Regular', factor: 1.0 },
                { label: 'Large', factor: 1.35 },
                { label: '2.0x', factor: 2.0 },
              ].map((p) => (
                <button
                  key={p.label}
                  onClick={() => handlePortionChange(p.factor)}
                  className={`py-1.5 text-xs font-semibold rounded-xl border transition ${
                    portionFactor === p.factor
                      ? 'bg-zinc-900 border-zinc-900 text-white'
                      : 'bg-white border-zinc-200 text-zinc-700 hover:border-zinc-300'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Micro Multipliers */}
            <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
              <span>Finer multipliers:</span>
              <div className="flex gap-1.5">
                {[0.5, 1.0, 1.5, 2.0].map((f) => (
                  <button
                    key={f}
                    onClick={() => handlePortionChange(f)}
                    className={`px-2 py-0.5 rounded-lg border text-[11px] font-medium transition ${
                      portionFactor === f
                        ? 'bg-zinc-800 text-white border-zinc-800'
                        : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-100'
                    }`}
                  >
                    {f}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Detected Food Components Breakdown */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-zinc-700">Detected Components</span>
              <button
                onClick={() => setIsEditingItems((v) => !v)}
                className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 flex items-center gap-1"
              >
                <Pencil className="w-3 h-3" />
                <span>{isEditingItems ? 'Done' : 'Edit Grams'}</span>
              </button>
            </div>

            <div className="space-y-2">
              {currentResult.foodItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-zinc-200/80 text-xs"
                >
                  <div className="flex-1 pr-2">
                    <div className="font-semibold text-zinc-900">{item.name}</div>
                    <div className="text-[11px] text-zinc-400 flex items-center gap-2 mt-0.5">
                      <span>{item.estimatedServing}</span>
                      <span>•</span>
                      <span>P: {item.proteinGrams}g</span>
                      <span>C: {item.carbsGrams}g</span>
                      <span>F: {item.fatGrams}g</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {isEditingItems ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={item.estimatedWeightGrams}
                          onChange={(e) =>
                            handleUpdateItemGram(idx, parseInt(e.target.value) || 0)
                          }
                          className="w-14 px-1.5 py-1 text-center bg-zinc-100 rounded-lg text-xs font-semibold border border-zinc-300"
                        />
                        <span className="text-[10px] text-zinc-500">g</span>
                        {currentResult.foodItems.length > 1 && (
                          <button
                            onClick={() => handleRemoveComponent(idx)}
                            className="p-1 text-zinc-400 hover:text-rose-600 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="text-right">
                        <div className="font-bold text-zinc-900">{item.calories} kcal</div>
                        <div className="text-[10px] text-zinc-400">
                          {item.estimatedWeightGrams}g
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Meal Section Target Selector */}
          <div>
            <label className="text-xs font-bold text-zinc-700 block mb-2">Log to Meal</label>
            <div className="grid grid-cols-4 gap-2">
              {(['breakfast', 'lunch', 'snack', 'dinner'] as MealType[]).map((meal) => (
                <button
                  key={meal}
                  onClick={() => setSelectedMealType(meal)}
                  className={`py-2 text-xs font-semibold capitalize rounded-xl border transition ${
                    selectedMealType === meal
                      ? 'bg-zinc-900 border-zinc-900 text-white'
                      : 'bg-white border-zinc-200 text-zinc-700 hover:border-zinc-300'
                  }`}
                >
                  {meal}
                </button>
              ))}
            </div>
          </div>

          {/* Educational Insight Tip */}
          {currentResult.insightTip && (
            <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-3 text-xs text-emerald-900 leading-relaxed flex items-start gap-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>{currentResult.insightTip}</span>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex items-center gap-2">
          <button
            id="btn-scan-again"
            onClick={onScanAgain}
            className="px-4 py-3.5 bg-white border border-zinc-200 text-zinc-700 font-semibold rounded-2xl hover:bg-zinc-100 text-xs flex items-center justify-center gap-1.5 transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Rescan</span>
          </button>

          <button
            id="btn-add-to-diary"
            onClick={handleSaveToDiary}
            className="flex-1 py-3.5 bg-zinc-900 hover:bg-black text-white font-semibold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-sm transition"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>Add to {selectedMealType.toUpperCase()}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
