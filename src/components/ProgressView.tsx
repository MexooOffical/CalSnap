import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, TrendingDown, TrendingUp, Sparkles, Scale, CheckCircle2 } from 'lucide-react';

export const ProgressView: React.FC = () => {
  const { userProfile, weightEntries, addWeightEntry, foodLogs } = useApp();
  const [newWeight, setNewWeight] = useState<string>(userProfile.weight.toString());
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [timeRange, setTimeRange] = useState<'7d' | '30d'>('7d');

  // Compute 7-day or 30-day calorie adherence
  const today = new Date();
  const pastDays = timeRange === '7d' ? 7 : 14;

  const dailyHistory = Array.from({ length: pastDays }).map((_, idx) => {
    const d = new Date();
    d.setDate(today.getDate() - (pastDays - 1 - idx));
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;

    const logs = foodLogs.filter((l) => l.date === dateStr);
    const calories = logs.reduce((acc, curr) => acc + curr.calories, 0);
    const protein = logs.reduce((acc, curr) => acc + curr.protein, 0);

    return {
      date: dateStr,
      displayDate: d.toLocaleDateString('en-IN', { weekday: 'narrow' }),
      calories,
      protein,
      target: userProfile.dailyCalories,
    };
  });

  const avgCalories = Math.round(
    dailyHistory.reduce((acc, d) => acc + d.calories, 0) / dailyHistory.length
  );
  const avgProtein = Math.round(
    dailyHistory.reduce((acc, d) => acc + d.protein, 0) / dailyHistory.length
  );

  const currentWeight =
    weightEntries.length > 0
      ? weightEntries[weightEntries.length - 1].weight
      : userProfile.weight;
  const initialWeight = weightEntries.length > 0 ? weightEntries[0].weight : userProfile.weight;
  const weightDiff = Number((currentWeight - initialWeight).toFixed(1));

  const handleSaveWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(newWeight);
    if (parsed > 0) {
      addWeightEntry(parsed);
      setShowWeightModal(false);
    }
  };

  return (
    <div id="progress-view" className="w-full pb-28 pt-2 space-y-4">
      {/* Header & Range Selector */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-xl font-extrabold text-zinc-900 tracking-tight">Your Progress</h2>
          <p className="text-xs text-zinc-400">Weekly consistency and physiological trends</p>
        </div>

        <div className="bg-zinc-100 p-1 rounded-xl flex">
          <button
            onClick={() => setTimeRange('7d')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
              timeRange === '7d' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setTimeRange('30d')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
              timeRange === '30d' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500'
            }`}
          >
            14 Days
          </button>
        </div>
      </div>

      {/* Weight Summary Card */}
      <div className="bg-white rounded-3xl p-5 border border-zinc-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-800">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
                Current Weight
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold text-zinc-900 tracking-tight">
                  {currentWeight}
                </span>
                <span className="text-xs font-semibold text-zinc-500">
                  {userProfile.weightUnit}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowWeightModal(true)}
            className="flex items-center gap-1.5 text-xs font-bold text-white bg-zinc-900 hover:bg-black px-3 py-2 rounded-xl transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Weight</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-zinc-50 text-xs">
          <div>
            <span className="text-zinc-400 font-medium block">Starting</span>
            <span className="font-bold text-zinc-800">
              {initialWeight} {userProfile.weightUnit}
            </span>
          </div>
          <div>
            <span className="text-zinc-400 font-medium block">Target</span>
            <span className="font-bold text-zinc-800">
              {userProfile.targetWeight} {userProfile.weightUnit}
            </span>
          </div>
          <div>
            <span className="text-zinc-400 font-medium block">Net Change</span>
            <span
              className={`font-bold flex items-center gap-0.5 ${
                weightDiff < 0 ? 'text-emerald-600' : weightDiff > 0 ? 'text-amber-600' : 'text-zinc-800'
              }`}
            >
              {weightDiff < 0 ? (
                <TrendingDown className="w-3.5 h-3.5" />
              ) : (
                <TrendingUp className="w-3.5 h-3.5" />
              )}
              {weightDiff > 0 ? `+${weightDiff}` : `${weightDiff}`} {userProfile.weightUnit}
            </span>
          </div>
        </div>
      </div>

      {/* Calorie Adherence Chart (Minimalist Bar Graph) */}
      <div className="bg-white rounded-3xl p-5 border border-zinc-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div className="flex justify-between items-baseline mb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
              Calorie Adherence
            </span>
            <div className="text-base font-bold text-zinc-900">
              Avg: {avgCalories} <span className="text-xs font-normal text-zinc-400">kcal/day</span>
            </div>
          </div>
          <div className="text-xs text-zinc-400 font-medium">
            Target: {userProfile.dailyCalories} kcal
          </div>
        </div>

        {/* Minimal Bar Chart */}
        <div className="flex items-end justify-between gap-2 h-36 pt-4 border-b border-zinc-100 pb-2">
          {dailyHistory.map((item, idx) => {
            const heightPercent =
              item.target > 0
                ? Math.min(100, Math.round((item.calories / (item.target * 1.3)) * 100))
                : 0;
            const isTargetMet = item.calories > 0 && Math.abs(item.calories - item.target) <= 250;

            return (
              <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                <div className="text-[9px] text-zinc-400 opacity-0 group-hover:opacity-100 transition mb-1 font-bold">
                  {item.calories}
                </div>
                <div className="w-full max-w-[28px] bg-zinc-100 rounded-t-lg h-full flex items-end overflow-hidden">
                  <div
                    className={`w-full rounded-t-lg transition-all duration-500 ${
                      item.calories === 0
                        ? 'bg-transparent'
                        : isTargetMet
                        ? 'bg-zinc-900'
                        : item.calories > item.target
                        ? 'bg-amber-600'
                        : 'bg-zinc-400'
                    }`}
                    style={{ height: `${Math.max(8, heightPercent)}%` }}
                  />
                </div>
                <span className="text-[10px] font-semibold text-zinc-400 mt-2">
                  {item.displayDate}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Indian Food Insights (Section 13 Requirement) */}
      <div className="bg-white rounded-3xl p-5 border border-zinc-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 rounded-lg bg-zinc-900 text-white flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-900">
            Aahar Nutrition Insights
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-100 text-xs text-zinc-700 leading-relaxed">
          <div className="font-bold text-zinc-900 mb-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>High Protein Consistency</span>
          </div>
          Your average protein intake this week is <span className="font-bold">{avgProtein}g</span>. Including sprouts and paneer has stabilized your macronutrient ratio.
        </div>

        <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-100 text-xs text-zinc-700 leading-relaxed">
          <div className="font-bold text-zinc-900 mb-1">Dietary Tip</div>
          Pairing dal and whole grains (phulkas or brown rice) delivers a complete essential amino acid profile, optimal for vegetarian diets.
        </div>
      </div>

      {/* Log Weight Modal */}
      {showWeightModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm border border-zinc-100 shadow-2xl">
            <h3 className="text-lg font-bold text-zinc-900 mb-1">Log Today's Weight</h3>
            <p className="text-xs text-zinc-400 mb-4">Consistent weigh-ins give accurate trends.</p>

            <form onSubmit={handleSaveWeight} className="space-y-4">
              <div className="flex items-center justify-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  required
                  autoFocus
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  className="w-32 text-center text-4xl font-extrabold text-zinc-900 border-b-2 border-zinc-900 focus:outline-none py-1"
                />
                <span className="text-base font-bold text-zinc-400">
                  {userProfile.weightUnit}
                </span>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowWeightModal(false)}
                  className="flex-1 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold rounded-2xl text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-zinc-900 hover:bg-black text-white font-semibold rounded-2xl text-xs transition"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
