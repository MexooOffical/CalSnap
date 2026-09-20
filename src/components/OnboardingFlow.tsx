import React, { useState } from 'react';
import { UserProfile, GoalType, ActivityLevel, DietPreference } from '../types';
import { calculateNutritionTargets } from '../utils/nutritionCalculations';
import { ArrowRight, ChevronLeft, Check, Sparkles, ShieldCheck } from 'lucide-react';

interface OnboardingFlowProps {
  initialProfile: UserProfile;
  onComplete: (profile: UserProfile) => void;
  onCancel?: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  initialProfile,
  onComplete,
  onCancel,
}) => {
  const [step, setStep] = useState<number>(1);

  // Form state
  const [name, setName] = useState(initialProfile.name || 'Aarav');
  const [goal, setGoal] = useState<GoalType>(initialProfile.goal || 'lose');
  const [weight, setWeight] = useState<number>(initialProfile.weight || 72);
  const [targetWeight, setTargetWeight] = useState<number>(initialProfile.targetWeight || 67);
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>('kg');
  const [height, setHeight] = useState<number>(initialProfile.height || 172);
  const [age, setAge] = useState<number>(initialProfile.age || 26);
  const [gender, setGender] = useState<'male' | 'female' | 'other'>(initialProfile.gender || 'male');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(
    initialProfile.activityLevel || 'moderate'
  );
  const [dietPreference, setDietPreference] = useState<DietPreference>(
    initialProfile.dietPreference || 'vegetarian'
  );

  // Computed targets for step 10
  const targets = calculateNutritionTargets({
    weightKg: weightUnit === 'lb' ? Math.round(weight * 0.453592) : weight,
    targetWeightKg: weightUnit === 'lb' ? Math.round(targetWeight * 0.453592) : targetWeight,
    heightCm: height,
    age,
    gender,
    activityLevel,
    goal,
  });

  const nextStep = () => setStep((s) => Math.min(10, s + 1));
  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  const handleFinish = () => {
    const finalProfile: UserProfile = {
      ...initialProfile,
      name: name.trim() || 'You',
      goal,
      weight: weightUnit === 'lb' ? Math.round(weight * 0.453592) : weight,
      targetWeight: weightUnit === 'lb' ? Math.round(targetWeight * 0.453592) : targetWeight,
      weightUnit,
      height,
      age,
      gender,
      activityLevel,
      dietPreference,
      dailyCalories: targets.dailyCalories,
      proteinTarget: targets.proteinGrams,
      carbTarget: targets.carbsGrams,
      fatTarget: targets.fatGrams,
      fiberTarget: targets.fiberGrams,
      isOnboarded: true,
      updatedAt: new Date().toISOString(),
    };
    onComplete(finalProfile);
  };

  return (
    <div id="onboarding-container" className="fixed inset-0 z-50 bg-zinc-50 flex flex-col justify-between overflow-y-auto">
      {/* Top Header with Progress Bar */}
      <div className="w-full max-w-md mx-auto pt-6 px-5 pb-2">
        <div className="flex items-center justify-between mb-4">
          {step > 1 ? (
            <button
              onClick={prevStep}
              className="p-1.5 -ml-1.5 rounded-full text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/60 transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          ) : (
            <div className="w-8" />
          )}

          <div className="text-xs font-semibold tracking-wider uppercase text-zinc-400">
            Step {step} of 10
          </div>

          {onCancel && step === 1 ? (
            <button
              onClick={onCancel}
              className="text-xs font-medium text-zinc-500 hover:text-zinc-900"
            >
              Close
            </button>
          ) : (
            <div className="w-8" />
          )}
        </div>

        {/* Progress line */}
        <div className="w-full bg-zinc-200 h-1 rounded-full overflow-hidden">
          <div
            className="bg-zinc-900 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${(step / 10) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Content Body */}
      <div className="w-full max-w-md mx-auto px-6 py-6 flex-1 flex flex-col justify-center">
        {/* Step 1: Intro */}
        {step === 1 && (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-3xl bg-zinc-900 text-white flex items-center justify-center mx-auto mb-6 shadow-md">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="inline-block px-3 py-1 bg-zinc-100 rounded-full text-xs font-semibold text-zinc-600 mb-3 tracking-wide">
              AAHAR AI NUTRITION
            </div>
            <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight leading-tight mb-3">
              Understand what you eat.
            </h1>
            <p className="text-sm text-zinc-500 max-w-xs mx-auto leading-relaxed mb-8">
              A minimalist AI vision tracker calibrated for authentic Indian meals, regional cuisines, and realistic portion estimation.
            </p>

            <div className="text-left mb-6">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-1.5">
                Your Name
              </label>
              <input
                id="input-onboarding-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aarav, Ananya"
                className="w-full bg-white border border-zinc-200 rounded-2xl px-4 py-3 text-base text-zinc-900 focus:outline-none focus:border-zinc-900 transition"
              />
            </div>

            <button
              id="btn-onboarding-start"
              onClick={nextStep}
              className="w-full py-4 bg-zinc-900 hover:bg-black text-white font-semibold rounded-2xl shadow-sm flex items-center justify-center gap-2 transition"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Goal */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-extrabold text-zinc-900 tracking-tight mb-2">
              What is your primary goal?
            </h2>
            <p className="text-sm text-zinc-500 mb-6">
              We calculate your daily energy balance based on this outcome.
            </p>

            <div className="space-y-3">
              {[
                {
                  id: 'lose',
                  title: 'Lose weight',
                  desc: 'Sustainable calorie deficit (~400-500 kcal reduction)',
                },
                {
                  id: 'maintain',
                  title: 'Maintain weight',
                  desc: 'Energy balance aligned with your daily expenditure',
                },
                {
                  id: 'gain',
                  title: 'Gain weight / Lean bulk',
                  desc: 'Mild surplus to support muscle recovery and growth',
                },
              ].map((item) => (
                <div
                  key={item.id}
                  id={`goal-card-${item.id}`}
                  onClick={() => setGoal(item.id as GoalType)}
                  className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                    goal === item.id
                      ? 'bg-zinc-900 border-zinc-900 text-white shadow-sm'
                      : 'bg-white border-zinc-200 text-zinc-900 hover:border-zinc-300'
                  }`}
                >
                  <div>
                    <div className="font-bold text-base">{item.title}</div>
                    <div
                      className={`text-xs mt-0.5 ${
                        goal === item.id ? 'text-zinc-300' : 'text-zinc-500'
                      }`}
                    >
                      {item.desc}
                    </div>
                  </div>
                  {goal === item.id && (
                    <div className="w-6 h-6 rounded-full bg-white text-zinc-900 flex items-center justify-center">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={nextStep}
              className="w-full mt-8 py-4 bg-zinc-900 text-white font-semibold rounded-2xl flex items-center justify-center gap-2 transition"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 3: Current Weight */}
        {step === 3 && (
          <div>
            <h2 className="text-2xl font-extrabold text-zinc-900 tracking-tight mb-2">
              What is your current weight?
            </h2>
            <p className="text-sm text-zinc-500 mb-6">
              Used for precise BMR and protein requirement estimates.
            </p>

            <div className="flex justify-center mb-6">
              <div className="bg-zinc-200/70 p-1 rounded-xl flex">
                <button
                  onClick={() => setWeightUnit('kg')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                    weightUnit === 'kg' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-600'
                  }`}
                >
                  kg (India default)
                </button>
                <button
                  onClick={() => setWeightUnit('lb')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                    weightUnit === 'lb' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-600'
                  }`}
                >
                  lb
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-zinc-200 flex flex-col items-center">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-extrabold text-zinc-900 tracking-tight">
                  {weight}
                </span>
                <span className="text-xl font-bold text-zinc-400">{weightUnit}</span>
              </div>

              <input
                type="range"
                min={weightUnit === 'kg' ? 35 : 77}
                max={weightUnit === 'kg' ? 150 : 330}
                step={weightUnit === 'kg' ? 0.5 : 1}
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value))}
                className="w-full mt-8 accent-zinc-900"
              />

              <div className="flex justify-between w-full text-xs text-zinc-400 mt-2">
                <span>{weightUnit === 'kg' ? '35 kg' : '77 lb'}</span>
                <span>{weightUnit === 'kg' ? '150 kg' : '330 lb'}</span>
              </div>
            </div>

            <button
              onClick={nextStep}
              className="w-full mt-8 py-4 bg-zinc-900 text-white font-semibold rounded-2xl flex items-center justify-center gap-2 transition"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 4: Target Weight */}
        {step === 4 && (
          <div>
            <h2 className="text-2xl font-extrabold text-zinc-900 tracking-tight mb-2">
              What is your target weight?
            </h2>
            <p className="text-sm text-zinc-500 mb-6">
              Your goal helps shape your pacing and recommended macro breakdown.
            </p>

            <div className="bg-white rounded-3xl p-6 border border-zinc-200 flex flex-col items-center">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-extrabold text-zinc-900 tracking-tight">
                  {targetWeight}
                </span>
                <span className="text-xl font-bold text-zinc-400">{weightUnit}</span>
              </div>

              <div className="mt-2 text-xs font-semibold px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-600">
                {targetWeight < weight
                  ? `Goal: -${(weight - targetWeight).toFixed(1)} ${weightUnit}`
                  : targetWeight > weight
                  ? `Goal: +${(targetWeight - weight).toFixed(1)} ${weightUnit}`
                  : 'Maintain current weight'}
              </div>

              <input
                type="range"
                min={weightUnit === 'kg' ? 35 : 77}
                max={weightUnit === 'kg' ? 150 : 330}
                step={weightUnit === 'kg' ? 0.5 : 1}
                value={targetWeight}
                onChange={(e) => setTargetWeight(parseFloat(e.target.value))}
                className="w-full mt-8 accent-zinc-900"
              />

              <div className="flex justify-between w-full text-xs text-zinc-400 mt-2">
                <span>{weightUnit === 'kg' ? '35 kg' : '77 lb'}</span>
                <span>{weightUnit === 'kg' ? '150 kg' : '330 lb'}</span>
              </div>
            </div>

            <button
              onClick={nextStep}
              className="w-full mt-8 py-4 bg-zinc-900 text-white font-semibold rounded-2xl flex items-center justify-center gap-2 transition"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 5: Height */}
        {step === 5 && (
          <div>
            <h2 className="text-2xl font-extrabold text-zinc-900 tracking-tight mb-2">
              What is your height?
            </h2>
            <p className="text-sm text-zinc-500 mb-6">
              Essential for calculating your basal metabolic rate.
            </p>

            <div className="bg-white rounded-3xl p-6 border border-zinc-200 flex flex-col items-center">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-extrabold text-zinc-900 tracking-tight">
                  {height}
                </span>
                <span className="text-xl font-bold text-zinc-400">cm</span>
              </div>
              <div className="text-xs text-zinc-400 mt-1">
                ({Math.floor(height / 30.48)} ft {Math.round((height % 30.48) / 2.54)} in)
              </div>

              <input
                type="range"
                min={130}
                max={220}
                value={height}
                onChange={(e) => setHeight(parseInt(e.target.value))}
                className="w-full mt-8 accent-zinc-900"
              />

              <div className="flex justify-between w-full text-xs text-zinc-400 mt-2">
                <span>130 cm</span>
                <span>220 cm</span>
              </div>
            </div>

            <button
              onClick={nextStep}
              className="w-full mt-8 py-4 bg-zinc-900 text-white font-semibold rounded-2xl flex items-center justify-center gap-2 transition"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 6: Age */}
        {step === 6 && (
          <div>
            <h2 className="text-2xl font-extrabold text-zinc-900 tracking-tight mb-2">
              How old are you?
            </h2>
            <p className="text-sm text-zinc-500 mb-6">
              Metabolism scales with biological age.
            </p>

            <div className="bg-white rounded-3xl p-6 border border-zinc-200 flex flex-col items-center">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-extrabold text-zinc-900 tracking-tight">
                  {age}
                </span>
                <span className="text-xl font-bold text-zinc-400">years</span>
              </div>

              <input
                type="range"
                min={14}
                max={90}
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value))}
                className="w-full mt-8 accent-zinc-900"
              />

              <div className="flex justify-between w-full text-xs text-zinc-400 mt-2">
                <span>14 yrs</span>
                <span>90 yrs</span>
              </div>
            </div>

            <button
              onClick={nextStep}
              className="w-full mt-8 py-4 bg-zinc-900 text-white font-semibold rounded-2xl flex items-center justify-center gap-2 transition"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 7: Gender */}
        {step === 7 && (
          <div>
            <h2 className="text-2xl font-extrabold text-zinc-900 tracking-tight mb-2">
              What is your gender?
            </h2>
            <p className="text-sm text-zinc-500 mb-6">
              Used in the Mifflin-St Jeor equation to estimate resting metabolic rate.
            </p>

            <div className="space-y-3">
              {[
                { id: 'male', label: 'Male' },
                { id: 'female', label: 'Female' },
                { id: 'other', label: 'Prefer not to specify / Other' },
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => setGender(item.id as any)}
                  className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                    gender === item.id
                      ? 'bg-zinc-900 border-zinc-900 text-white'
                      : 'bg-white border-zinc-200 text-zinc-900 hover:border-zinc-300'
                  }`}
                >
                  <span className="font-bold text-base">{item.label}</span>
                  {gender === item.id && <Check className="w-5 h-5 stroke-[2.5]" />}
                </div>
              ))}
            </div>

            <button
              onClick={nextStep}
              className="w-full mt-8 py-4 bg-zinc-900 text-white font-semibold rounded-2xl flex items-center justify-center gap-2 transition"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 8: Activity Level */}
        {step === 8 && (
          <div>
            <h2 className="text-2xl font-extrabold text-zinc-900 tracking-tight mb-2">
              What is your activity level?
            </h2>
            <p className="text-sm text-zinc-500 mb-5">
              Reflects your non-exercise daily movement and workouts.
            </p>

            <div className="space-y-2.5">
              {[
                {
                  id: 'sedentary',
                  title: 'Sedentary',
                  desc: 'Desk job, minimal daily movement or walks',
                },
                {
                  id: 'light',
                  title: 'Lightly active',
                  desc: 'Light activity or 1–3 light walks/workouts a week',
                },
                {
                  id: 'moderate',
                  title: 'Moderately active',
                  desc: 'Gym, brisk walking or yoga 3–5 days a week',
                },
                {
                  id: 'very_active',
                  title: 'Very active',
                  desc: 'Intense training, sport, or physical job 6–7 days',
                },
                {
                  id: 'extremely_active',
                  title: 'Extremely active',
                  desc: 'Daily heavy labor or athletic endurance sessions',
                },
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActivityLevel(item.id as ActivityLevel)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                    activityLevel === item.id
                      ? 'bg-zinc-900 border-zinc-900 text-white shadow-sm'
                      : 'bg-white border-zinc-200 text-zinc-900 hover:border-zinc-300'
                  }`}
                >
                  <div>
                    <div className="font-bold text-sm">{item.title}</div>
                    <div
                      className={`text-xs mt-0.5 ${
                        activityLevel === item.id ? 'text-zinc-300' : 'text-zinc-500'
                      }`}
                    >
                      {item.desc}
                    </div>
                  </div>
                  {activityLevel === item.id && (
                    <Check className="w-4 h-4 stroke-[3] shrink-0 ml-2" />
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={nextStep}
              className="w-full mt-6 py-4 bg-zinc-900 text-white font-semibold rounded-2xl flex items-center justify-center gap-2 transition"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 9: Dietary Preference */}
        {step === 9 && (
          <div>
            <h2 className="text-2xl font-extrabold text-zinc-900 tracking-tight mb-2">
              Dietary Preference
            </h2>
            <p className="text-sm text-zinc-500 mb-6">
              Tailors AI recipe alternatives and nutrition suggestions.
            </p>

            <div className="space-y-3">
              {[
                {
                  id: 'vegetarian',
                  title: 'Vegetarian',
                  desc: 'Dairy, pulses, grains, vegetables (No meat or eggs)',
                },
                {
                  id: 'non_vegetarian',
                  title: 'Non-Vegetarian',
                  desc: 'Chicken, mutton, fish, eggs, dairy, vegetables',
                },
                {
                  id: 'eggetarian',
                  title: 'Eggetarian',
                  desc: 'Vegetarian + eggs for quality protein',
                },
                {
                  id: 'vegan',
                  title: 'Vegan',
                  desc: '100% plant-based (No dairy, curd, ghee, or honey)',
                },
                {
                  id: 'jain',
                  title: 'Jain Vegetarian',
                  desc: 'Vegetarian excluding root vegetables (potato, onion, garlic)',
                },
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => setDietPreference(item.id as DietPreference)}
                  className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                    dietPreference === item.id
                      ? 'bg-zinc-900 border-zinc-900 text-white shadow-sm'
                      : 'bg-white border-zinc-200 text-zinc-900 hover:border-zinc-300'
                  }`}
                >
                  <div>
                    <div className="font-bold text-base">{item.title}</div>
                    <div
                      className={`text-xs mt-0.5 ${
                        dietPreference === item.id ? 'text-zinc-300' : 'text-zinc-500'
                      }`}
                    >
                      {item.desc}
                    </div>
                  </div>
                  {dietPreference === item.id && (
                    <Check className="w-5 h-5 stroke-[2.5]" />
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={nextStep}
              className="w-full mt-8 py-4 bg-zinc-900 text-white font-semibold rounded-2xl flex items-center justify-center gap-2 transition"
            >
              <span>Calculate My Target</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 10: Personalized Result Setup */}
        {step === 10 && (
          <div className="text-center py-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold mb-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Target Configured</span>
            </div>

            <div className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-1">
              Your Daily Target
            </div>
            <div className="text-5xl font-extrabold text-zinc-900 tracking-tight mb-6">
              {targets.dailyCalories.toLocaleString()}{' '}
              <span className="text-xl font-normal text-zinc-500">kcal</span>
            </div>

            {/* Macro Cards */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-white rounded-2xl p-3 border border-zinc-200">
                <div className="text-[11px] font-semibold text-zinc-400 uppercase">Protein</div>
                <div className="text-xl font-bold text-zinc-900 mt-0.5">
                  {targets.proteinGrams}g
                </div>
                <div className="text-[10px] text-zinc-400 mt-0.5">Muscle &amp; satiety</div>
              </div>

              <div className="bg-white rounded-2xl p-3 border border-zinc-200">
                <div className="text-[11px] font-semibold text-zinc-400 uppercase">Carbs</div>
                <div className="text-xl font-bold text-zinc-900 mt-0.5">
                  {targets.carbsGrams}g
                </div>
                <div className="text-[10px] text-zinc-400 mt-0.5">Daily energy</div>
              </div>

              <div className="bg-white rounded-2xl p-3 border border-zinc-200">
                <div className="text-[11px] font-semibold text-zinc-400 uppercase">Fats</div>
                <div className="text-xl font-bold text-zinc-900 mt-0.5">
                  {targets.fatGrams}g
                </div>
                <div className="text-[10px] text-zinc-400 mt-0.5">Hormone balance</div>
              </div>
            </div>

            {/* Non-medical Educational Disclaimer */}
            <div className="bg-zinc-100/80 rounded-2xl p-3.5 text-left text-xs text-zinc-600 leading-relaxed mb-8">
              <span className="font-semibold text-zinc-800">Educational Estimate:</span>{' '}
              Calculated using the clinical Mifflin-St Jeor formula and activity multipliers. Individual energy expenditures vary. You can easily refine this anytime in Settings.
            </div>

            <button
              id="btn-onboarding-finish"
              onClick={handleFinish}
              className="w-full py-4 bg-zinc-900 hover:bg-black text-white font-semibold rounded-2xl shadow-sm flex items-center justify-center gap-2 transition"
            >
              <span>Enter App</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
