import { AIAnalysisResult, FoodItemComponent } from '../types';
import { getIntelligentFoodProfile } from './nutritionIntelligence';

/**
 * Image compression utility to optimize mobile photo uploads
 */
export async function compressImage(
  fileOrBase64: File | string,
  maxWidth = 1024,
  maxHeight = 1024,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      let { width, height } = img;

      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get 2D canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedDataUrl);
    };

    img.onerror = () => {
      reject(new Error('Could not load image for compression'));
    };

    if (typeof fileOrBase64 === 'string') {
      img.src = fileOrBase64;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(fileOrBase64);
    }
  });
}

/**
 * Food Recognition Service
 * Communicates with the secure server-side AI endpoint
 */
export async function analyzeFoodImage(
  imageBase64: string,
  userDescription?: string
): Promise<AIAnalysisResult> {
  try {
    // Compress first for fast upload
    const compressed = await compressImage(imageBase64, 1024, 1024, 0.82);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const response = await fetch('/api/analyze-food', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        imageBase64: compressed,
        mimeType: 'image/jpeg',
        userHint: userDescription || '',
      }),
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const data = await response.json();

    return {
      mealTitle: data.mealTitle || 'Indian Meal',
      confidence: typeof data.confidence === 'number' ? data.confidence : 0.92,
      isUncertain: Boolean(data.isUncertain),
      alternatives: data.alternatives || [],
      foodItems: data.foodItems || [],
      totalCalories: Math.round(data.totalCalories || 0),
      totalProtein: Math.round(data.totalProtein || 0),
      totalCarbs: Math.round(data.totalCarbs || 0),
      totalFat: Math.round(data.totalFat || 0),
      totalFiber: Math.round(data.totalFiber || 0),
      insightTip: data.insightTip,
      imageUrl: compressed,
      isSimulation: data.isSimulation,
    };
  } catch (err: any) {
    console.warn('Network call to AI endpoint failed, using intelligent client backup:', err);
    return getLocalBackupAnalysis(imageBase64, userDescription);
  }
}

/**
 * Resilient client-side fallback utilizing authentic ICMR-calibrated Indian food database
 */
function getLocalBackupAnalysis(
  imageBase64: string,
  userHint?: string
): AIAnalysisResult {
  const profile = getIntelligentFoodProfile(userHint);

  return {
    ...profile,
    imageUrl: imageBase64,
    isSimulation: true,
  };
}

/**
 * Recalculates nutrition when user scales portion (0.5x, 1x, 1.5x, 2x or small/regular/large)
 */
export function scaleNutrition(
  analysis: AIAnalysisResult,
  factor: number
): AIAnalysisResult {
  const scaledItems: FoodItemComponent[] = analysis.foodItems.map((item) => ({
    ...item,
    estimatedWeightGrams: Math.round(item.estimatedWeightGrams * factor),
    calories: Math.round(item.calories * factor),
    proteinGrams: Number((item.proteinGrams * factor).toFixed(1)),
    carbsGrams: Number((item.carbsGrams * factor).toFixed(1)),
    fatGrams: Number((item.fatGrams * factor).toFixed(1)),
    fiberGrams: item.fiberGrams
      ? Number((item.fiberGrams * factor).toFixed(1))
      : undefined,
  }));

  const totalCalories = scaledItems.reduce((acc, curr) => acc + curr.calories, 0);
  const totalProtein = Number(
    scaledItems.reduce((acc, curr) => acc + curr.proteinGrams, 0).toFixed(1)
  );
  const totalCarbs = Number(
    scaledItems.reduce((acc, curr) => acc + curr.carbsGrams, 0).toFixed(1)
  );
  const totalFat = Number(
    scaledItems.reduce((acc, curr) => acc + curr.fatGrams, 0).toFixed(1)
  );
  const totalFiber = Number(
    scaledItems.reduce((acc, curr) => acc + (curr.fiberGrams || 0), 0).toFixed(1)
  );

  return {
    ...analysis,
    foodItems: scaledItems,
    totalCalories,
    totalProtein,
    totalCarbs,
    totalFat,
    totalFiber,
  };
}
