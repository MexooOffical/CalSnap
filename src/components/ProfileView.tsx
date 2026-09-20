import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserProfile, GoalType, ActivityLevel, DietPreference } from '../types';
import { User, Settings, Sparkles, RotateCcw, ShieldCheck, ChevronRight } from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { userProfile, updateProfile, resetToOnboarding } = useApp();
  const [isEditing, setIsEditing] = useState(false);

  // Edit fields
  const [name, setName] = useState(userProfile.name);
  const [dailyCalories, setDailyCalories] = useState(userProfile.dailyCalories);
  const [proteinTarget, setProteinTarget] = useState(userProfile.proteinTarget);
  const [carbTarget, setCarbTarget] = useState(userProfile.carbTarget);
  const [fatTarget, setFatTarget] = useState(userProfile.fatTarget);
  const [diet, setDiet] = useState<DietPreference>(userProfile.dietPreference);
  const [goal, setGoal] = useState<GoalType>(userProfile.goal);
  const [targetWeight, setTargetWeight] = useState(userProfile.targetWeight);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      dailyCalories: Number(dailyCalories),
      proteinTarget: Number(proteinTarget),
      carbTarget: Number(carbTarget),
      fatTarget: Number(fatTarget),
      dietPreference: diet,
      goal,
      targetWeight: Number(targetWeight),
    });
    setIsEditing(false);
  };

  return (
    <div id="profile-view" className="w-full pb-28 pt-2 space-y-4">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-5 border border-zinc-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-13 h-13 rounded-2xl bg-zinc-900 text-white flex items-center justify-center font-bold text-lg">
            {userProfile.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-zinc-900 leading-tight">
              {userProfile.name}
            </h2>
            <p className="text-xs text-zinc-400 capitalize">
              {userProfile.dietPreference} • {userProfile.goal} goal
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsEditing((v) => !v)}
          className="px-3.5 py-1.5 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-700 hover:bg-zinc-50 transition"
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {isEditing ? (
        <form
          onSubmit={handleSave}
          className="bg-white rounded-3xl p-5 border border-zinc-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-4"
        >
          <div className="text-sm font-bold text-zinc-900 mb-2">Edit Goals &amp; Metrics</div>

          <div>
            <label className="text-xs font-semibold text-zinc-500 uppercase block mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-zinc-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase block mb-1">
                Daily Target (kcal)
              </label>
              <input
                type="number"
                value={dailyCalories}
                onChange={(e) => setDailyCalories(parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-sm font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase block mb-1">
                Target Weight ({userProfile.weightUnit})
              </label>
              <input
                type="number"
                step="0.1"
                value={targetWeight}
                onChange={(e) => setTargetWeight(parseFloat(e.target.value) || 0)}
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
                value={proteinTarget}
                onChange={(e) => setProteinTarget(parseInt(e.target.value) || 0)}
                className="w-full px-2 py-1.5 rounded-xl border border-zinc-200 text-xs text-center font-bold"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-zinc-500 uppercase block mb-1">
                Carbs (g)
              </label>
              <input
                type="number"
                value={carbTarget}
                onChange={(e) => setCarbTarget(parseInt(e.target.value) || 0)}
                className="w-full px-2 py-1.5 rounded-xl border border-zinc-200 text-xs text-center font-bold"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-zinc-500 uppercase block mb-1">
                Fats (g)
              </label>
              <input
                type="number"
                value={fatTarget}
                onChange={(e) => setFatTarget(parseInt(e.target.value) || 0)}
                className="w-full px-2 py-1.5 rounded-xl border border-zinc-200 text-xs text-center font-bold"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-500 uppercase block mb-1">
              Dietary Preference
            </label>
            <select
              value={diet}
              onChange={(e) => setDiet(e.target.value as DietPreference)}
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm bg-white"
            >
              <option value="vegetarian">Vegetarian</option>
              <option value="non_vegetarian">Non-Vegetarian</option>
              <option value="eggetarian">Eggetarian</option>
              <option value="vegan">Vegan</option>
              <option value="jain">Jain Vegetarian</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-zinc-900 text-white font-semibold rounded-2xl text-xs transition"
          >
            Save Changes
          </button>
        </form>
      ) : (
        /* Read-only Metrics Card */
        <div className="bg-white rounded-3xl p-5 border border-zinc-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Current Target &amp; Metrics
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-100">
              <span className="text-[10px] font-semibold text-zinc-400 uppercase block">
                Daily Calories
              </span>
              <span className="text-lg font-bold text-zinc-900">
                {userProfile.dailyCalories} kcal
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-100">
              <span className="text-[10px] font-semibold text-zinc-400 uppercase block">
                Target Weight
              </span>
              <span className="text-lg font-bold text-zinc-900">
                {userProfile.targetWeight} {userProfile.weightUnit}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100 text-center">
              <span className="text-[10px] font-semibold text-zinc-400 uppercase block">
                Protein
              </span>
              <span className="text-sm font-bold text-zinc-900">
                {userProfile.proteinTarget}g
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100 text-center">
              <span className="text-[10px] font-semibold text-zinc-400 uppercase block">Carbs</span>
              <span className="text-sm font-bold text-zinc-900">{userProfile.carbTarget}g</span>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100 text-center">
              <span className="text-[10px] font-semibold text-zinc-400 uppercase block">Fat</span>
              <span className="text-sm font-bold text-zinc-900">{userProfile.fatTarget}g</span>
            </div>
          </div>
        </div>
      )}

      {/* Re-calibrate / Reset Actions */}
      <div className="bg-white rounded-3xl p-5 border border-zinc-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">
          Preferences &amp; Calibration
        </div>

        <button
          onClick={resetToOnboarding}
          className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-zinc-50 hover:bg-zinc-100 transition text-left"
        >
          <div className="flex items-center gap-3">
            <RotateCcw className="w-4 h-4 text-zinc-600" />
            <div>
              <div className="text-xs font-bold text-zinc-900">Retake Onboarding Flow</div>
              <div className="text-[11px] text-zinc-400">
                Recalibrate BMR, goals, and targets from step 1
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-400" />
        </button>
      </div>

      {/* Clinical / Educational Safety Notice */}
      <div className="p-4 rounded-3xl bg-zinc-50 border border-zinc-200/80 text-xs text-zinc-500 leading-relaxed space-y-1">
        <div className="font-bold text-zinc-800 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-zinc-700" />
          <span>Non-Medical Educational Notice</span>
        </div>
        <p>
          Aahar AI estimates calorie, macro, and portion values based on visual heuristics and ICMR dietary reference guidelines. It is designed for nutritional mindfulness, not clinical diagnosis or medical therapy.
        </p>
      </div>
    </div>
  );
};
