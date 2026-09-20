import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { CalAiHomeView } from './components/CalAiHomeView';
import { AnalyticsView } from './components/AnalyticsView';
import { SettingsView } from './components/SettingsView';
import { CalAiNavigation } from './components/CalAiNavigation';
import { DiaryView } from './components/DiaryView';
import { ProgressView } from './components/ProgressView';
import { ProfileView } from './components/ProfileView';
import { FoodScannerModal } from './components/FoodScannerModal';
import { AIResultModal } from './components/AIResultModal';
import { FoodSearchModal } from './components/FoodSearchModal';
import { EditLogModal } from './components/EditLogModal';
import { OnboardingFlow } from './components/OnboardingFlow';
import { MealType, FoodLogItem } from './types';

const MainAppContent: React.FC = () => {
  const {
    userProfile,
    activeTab,
    setActiveTab,
    isScannerOpen,
    closeScanner,
    openScanner,
    isSearchOpen,
    closeSearch,
    targetMealType,
    aiResultData,
    setAiResultData,
    editingLogItem,
    setEditingLogItem,
    addFoodLog,
    updateFoodLog,
    deleteFoodLog,
    finishOnboarding,
    updateProfile,
  } = useApp();

  // If user has not onboarded or chose to re-onboard, show the 10-step flow
  if (!userProfile.isOnboarded) {
    return (
      <OnboardingFlow
        initialProfile={userProfile}
        onComplete={finishOnboarding}
      />
    );
  }

  // Handle logging AI detected meal to diary
  const handleAddAIResultToDiary = (data: {
    mealType: MealType;
    mealTitle: string;
    servingSize: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    weightGrams: number;
    components: any[];
    imageUrl?: string;
  }) => {
    const todayStr = new Date().toISOString().split('T')[0];

    addFoodLog({
      date: todayStr,
      mealType: data.mealType,
      foodName: data.mealTitle,
      servingSize: data.servingSize,
      quantity: 1,
      weightGrams: data.weightGrams,
      calories: data.calories,
      protein: data.protein,
      carbs: data.carbs,
      fat: data.fat,
      fiber: data.fiber,
      components: data.components,
      imageUrl: data.imageUrl,
      source: 'ai',
    });

    setAiResultData(null);
  };

  // Handle search selection
  const handleSelectFromSearch = (entry: {
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
  }) => {
    const todayStr = new Date().toISOString().split('T')[0];

    addFoodLog({
      date: todayStr,
      mealType: entry.mealType,
      foodName: entry.foodName,
      servingSize: entry.servingSize,
      quantity: entry.quantity,
      weightGrams: entry.weightGrams,
      calories: entry.calories,
      protein: entry.protein,
      carbs: entry.carbs,
      fat: entry.fat,
      fiber: entry.fiber ?? 0,
      source: 'manual',
    });
  };

  return (
    <div className="min-h-screen bg-[#e8e8ef] flex justify-center selection:bg-zinc-900 selection:text-white">
      {/* Mobile Shell Container */}
      <div className="w-full max-w-[390px] min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#fff3f4]/45 via-[#f7f7fb] to-[#f4f4f8] flex flex-col relative px-4 pt-1 shadow-2xl border-x border-black/[0.04]">
        {/* Main View Router */}
        <main className="flex-1">
          {activeTab === 'home' && <CalAiHomeView />}
          {activeTab === 'analytics' && <AnalyticsView />}
          {activeTab === 'settings' && <SettingsView />}
          {activeTab === 'diary' && <DiaryView />}
          {activeTab === 'progress' && <ProgressView />}
          {activeTab === 'profile' && <ProfileView />}
        </main>

        {/* Minimalist Bottom Navigation matching screenshot */}
        <CalAiNavigation
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onOpenScan={() => openScanner()}
        />

        {/* Camera / AI Scanner Modal */}
        <FoodScannerModal
          isOpen={isScannerOpen}
          onClose={closeScanner}
          onScanComplete={(result) => {
            setAiResultData(result);
          }}
        />

        {/* AI Result & Breakdown Modal */}
        <AIResultModal
          isOpen={Boolean(aiResultData)}
          result={aiResultData}
          defaultMealType={targetMealType}
          onClose={() => setAiResultData(null)}
          onAddToDiary={handleAddAIResultToDiary}
          onScanAgain={() => {
            setAiResultData(null);
            openScanner(targetMealType);
          }}
        />

        {/* Manual Indian Food Search Modal */}
        <FoodSearchModal
          isOpen={isSearchOpen}
          targetMealType={targetMealType}
          onClose={closeSearch}
          onSelectFood={handleSelectFromSearch}
        />

        {/* Edit / Detail Log Modal */}
        <EditLogModal
          item={editingLogItem}
          onClose={() => setEditingLogItem(null)}
          onSave={updateFoodLog}
          onDelete={deleteFoodLog}
        />
      </div>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}

export default App;
