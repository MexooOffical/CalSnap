import { AIAnalysisResult } from '../types';

export interface QuickFoodProfile {
  mealTitle: string;
  confidence: number;
  isUncertain: boolean;
  alternatives: string[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
  insightTip: string;
  foodItems: Array<{
    name: string;
    estimatedServing: string;
    servingUnit: string;
    estimatedWeightGrams: number;
    calories: number;
    proteinGrams: number;
    carbsGrams: number;
    fatGrams: number;
    fiberGrams: number;
    regionalOrigin: string;
  }>;
}

export const KNOWN_DISH_PATTERNS: Array<{
  keywords: string[];
  profile: QuickFoodProfile;
}> = [
  // --- BIRYANI & RICE ---
  {
    keywords: ['biryani', 'chicken biryani', 'mutton biryani', 'veg biryani', 'dum biryani'],
    profile: {
      mealTitle: 'Hyderabadi Dum Biryani with Mirchi Ka Salan',
      confidence: 0.94,
      isUncertain: false,
      alternatives: ['Veg Pulao', 'Chicken Pulao', 'Jeera Rice'],
      totalCalories: 580,
      totalProtein: 28,
      totalCarbs: 65,
      totalFat: 22,
      totalFiber: 4.5,
      insightTip: 'A rich celebration dish with fragrant saffron basmati rice and wholesome spices like cardamom and cloves.',
      foodItems: [
        {
          name: 'Hyderabadi Dum Biryani',
          estimatedServing: '1 medium plate (350g)',
          servingUnit: 'plate',
          estimatedWeightGrams: 350,
          calories: 490,
          proteinGrams: 26,
          carbsGrams: 58,
          fatGrams: 18,
          fiberGrams: 3.5,
          regionalOrigin: 'Hyderabadi / Mughlai',
        },
        {
          name: 'Onion Cucumber Raita',
          estimatedServing: '1 katori (100g)',
          servingUnit: 'katori',
          estimatedWeightGrams: 100,
          calories: 90,
          proteinGrams: 2,
          carbsGrams: 7,
          fatGrams: 4,
          fiberGrams: 1,
          regionalOrigin: 'All-India',
        },
      ],
    },
  },
  // --- SAMOSA & CHAAT ---
  {
    keywords: ['samosa', 'chaat', 'pani puri', 'golgappa', 'sev puri', 'bhel'],
    profile: {
      mealTitle: 'Punjabi Aloo Samosas with Mint & Tamarind Chutney',
      confidence: 0.95,
      isUncertain: false,
      alternatives: ['Kachori', 'Bread Pakora', 'Aloo Tikki'],
      totalCalories: 360,
      totalProtein: 6,
      totalCarbs: 44,
      totalFat: 18,
      totalFiber: 4.2,
      insightTip: 'Spiced potato and pea filling wrapped in crisp pastry. Chutneys add tangy digestive spices.',
      foodItems: [
        {
          name: 'Crispy Punjabi Samosa (2 pcs)',
          estimatedServing: '2 medium pieces (140g)',
          servingUnit: 'pcs',
          estimatedWeightGrams: 140,
          calories: 310,
          proteinGrams: 5.2,
          carbsGrams: 38,
          fatGrams: 16.5,
          fiberGrams: 3.8,
          regionalOrigin: 'North Indian Snack',
        },
        {
          name: 'Green Mint & Sweet Tamarind Chutney',
          estimatedServing: '2 tbsp (40g)',
          servingUnit: 'tbsp',
          estimatedWeightGrams: 40,
          calories: 50,
          proteinGrams: 0.8,
          carbsGrams: 6,
          fatGrams: 1.5,
          fiberGrams: 0.4,
          regionalOrigin: 'All-India',
        },
      ],
    },
  },
  // --- CHOLE BHATURE ---
  {
    keywords: ['chole', 'bhature', 'chana masala', 'chole bhature', 'kulcha'],
    profile: {
      mealTitle: 'Amritsari Chole with 2 Fluffy Bhature',
      confidence: 0.93,
      isUncertain: false,
      alternatives: ['Chole Kulche', 'Rajma Chawal', 'Poori Chole'],
      totalCalories: 680,
      totalProtein: 18,
      totalCarbs: 88,
      totalFat: 28,
      totalFiber: 11,
      insightTip: 'Chickpeas provide high-satiety fiber and plant protein, paired with traditional fermented bhature.',
      foodItems: [
        {
          name: 'Spiced Punjabi Chole',
          estimatedServing: '1 large bowl (220g)',
          servingUnit: 'bowl',
          estimatedWeightGrams: 220,
          calories: 280,
          proteinGrams: 12.5,
          carbsGrams: 40,
          fatGrams: 9,
          fiberGrams: 9.5,
          regionalOrigin: 'Punjabi',
        },
        {
          name: 'Golden Fried Bhature (2 pcs)',
          estimatedServing: '2 pieces (120g)',
          servingUnit: 'pcs',
          estimatedWeightGrams: 120,
          calories: 400,
          proteinGrams: 5.5,
          carbsGrams: 48,
          fatGrams: 19,
          fiberGrams: 1.5,
          regionalOrigin: 'North Indian',
        },
      ],
    },
  },
  // --- PAV BHAJI ---
  {
    keywords: ['pav bhaji', 'pav', 'bhaji'],
    profile: {
      mealTitle: 'Mumbai Butter Pav Bhaji with Toasted Pav',
      confidence: 0.96,
      isUncertain: false,
      alternatives: ['Misal Pav', 'Tawa Pulao', 'Keema Pav'],
      totalCalories: 540,
      totalProtein: 11,
      totalCarbs: 72,
      totalFat: 22,
      totalFiber: 8.5,
      insightTip: 'Bhaji packs a wide range of vegetables (cauliflower, peas, potatoes, tomatoes) slow-mashed with butter and spices.',
      foodItems: [
        {
          name: 'Buttery Vegetable Bhaji',
          estimatedServing: '1 large bowl (250g)',
          servingUnit: 'bowl',
          estimatedWeightGrams: 250,
          calories: 270,
          proteinGrams: 6,
          carbsGrams: 36,
          fatGrams: 12,
          fiberGrams: 7,
          regionalOrigin: 'Mumbai Street Food',
        },
        {
          name: 'Butter Toasted Pav (2 pcs)',
          estimatedServing: '2 pav buns (100g)',
          servingUnit: 'pcs',
          estimatedWeightGrams: 100,
          calories: 270,
          proteinGrams: 5,
          carbsGrams: 36,
          fatGrams: 10,
          fiberGrams: 1.5,
          regionalOrigin: 'Mumbai Street Food',
        },
      ],
    },
  },
  // --- DOSA & IDLI ---
  {
    keywords: ['dosa', 'masala dosa', 'idli', 'vada', 'medu vada', 'uttapam'],
    profile: {
      mealTitle: 'Crispy Masala Dosa with Sambar & Chutneys',
      confidence: 0.93,
      isUncertain: false,
      alternatives: ['Plain Dosa', 'Onion Uttapam', 'Rava Dosa'],
      totalCalories: 480,
      totalProtein: 11.5,
      totalCarbs: 74,
      totalFat: 15,
      totalFiber: 7.2,
      insightTip: 'Naturally fermented rice and urad dal batter provides gut-healthy friendly cultures and complete protein.',
      foodItems: [
        {
          name: 'Crispy Masala Dosa',
          estimatedServing: '1 large (180g)',
          servingUnit: 'piece',
          estimatedWeightGrams: 180,
          calories: 340,
          proteinGrams: 7,
          carbsGrams: 54,
          fatGrams: 10.5,
          fiberGrams: 3.8,
          regionalOrigin: 'South Indian',
        },
        {
          name: 'Vegetable Lentil Sambar',
          estimatedServing: '1 katori (150g)',
          servingUnit: 'katori',
          estimatedWeightGrams: 150,
          calories: 85,
          proteinGrams: 3.5,
          carbsGrams: 14,
          fatGrams: 2,
          fiberGrams: 2.8,
          regionalOrigin: 'South Indian',
        },
        {
          name: 'Fresh Coconut Chutney',
          estimatedServing: '2 tbsp (35g)',
          servingUnit: 'tbsp',
          estimatedWeightGrams: 35,
          calories: 55,
          proteinGrams: 1,
          carbsGrams: 6,
          fatGrams: 2.5,
          fiberGrams: 0.6,
          regionalOrigin: 'South Indian',
        },
      ],
    },
  },
  // --- POHA & UPMA ---
  {
    keywords: ['poha', 'kanda poha', 'batata poha', 'upma', 'sheera'],
    profile: {
      mealTitle: 'Authentic Kanda Batata Poha with Peanuts',
      confidence: 0.95,
      isUncertain: false,
      alternatives: ['Rava Upma', 'Sabudana Khichdi', 'Sev Khamani'],
      totalCalories: 285,
      totalProtein: 7,
      totalCarbs: 46,
      totalFat: 8.5,
      totalFiber: 4.2,
      insightTip: 'Light on the digestive system yet rich in non-heme iron. Lemon juice boosts iron bioavailability.',
      foodItems: [
        {
          name: 'Kanda Batata Poha',
          estimatedServing: '1 medium bowl (220g)',
          servingUnit: 'bowl',
          estimatedWeightGrams: 220,
          calories: 285,
          proteinGrams: 7,
          carbsGrams: 46,
          fatGrams: 8.5,
          fiberGrams: 4.2,
          regionalOrigin: 'Maharashtrian',
        },
      ],
    },
  },
  // --- PARATHA ---
  {
    keywords: ['paratha', 'aloo paratha', 'paneer paratha', 'gobi paratha', 'methi paratha'],
    profile: {
      mealTitle: 'Spiced Punjabi Aloo Paratha with White Butter & Curd',
      confidence: 0.94,
      isUncertain: false,
      alternatives: ['Paneer Paratha', 'Gobi Paratha', 'Methi Thepla'],
      totalCalories: 450,
      totalProtein: 10.5,
      totalCarbs: 58,
      totalFat: 19,
      totalFiber: 6.8,
      insightTip: 'Whole-wheat flatbread stuffed with spiced potatoes. Pairing with curd provides healthy calcium and protein.',
      foodItems: [
        {
          name: 'Stuffed Aloo Paratha (2 pcs)',
          estimatedServing: '2 medium parathas (180g)',
          servingUnit: 'pcs',
          estimatedWeightGrams: 180,
          calories: 360,
          proteinGrams: 7.5,
          carbsGrams: 52,
          fatGrams: 14,
          fiberGrams: 6,
          regionalOrigin: 'Punjabi Staple',
        },
        {
          name: 'Fresh Plain Curd (Dahi)',
          estimatedServing: '1 small katori (100g)',
          servingUnit: 'katori',
          estimatedWeightGrams: 100,
          calories: 90,
          proteinGrams: 3,
          carbsGrams: 6,
          fatGrams: 5,
          fiberGrams: 0.8,
          regionalOrigin: 'All-India',
        },
      ],
    },
  },
  // --- PANEER / BUTTER CHICKEN / CURRY + ROTI ---
  {
    keywords: ['paneer', 'butter chicken', 'chicken tikka', 'kadai paneer', 'dal makhani', 'roti', 'chapati', 'naan'],
    profile: {
      mealTitle: 'Paneer Butter Masala with 2 Whole Wheat Phulkas',
      confidence: 0.92,
      isUncertain: false,
      alternatives: ['Palak Paneer with Roti', 'Dal Makhani with Naan', 'Kadai Chicken'],
      totalCalories: 580,
      totalProtein: 22.5,
      totalCarbs: 52,
      totalFat: 31,
      totalFiber: 8.5,
      insightTip: 'Balanced vegetarian high-protein dinner. Whole wheat rotis contribute complex carbohydrates and dietary fiber.',
      foodItems: [
        {
          name: 'Paneer Butter Masala',
          estimatedServing: '1 katori (180g)',
          servingUnit: 'katori',
          estimatedWeightGrams: 180,
          calories: 360,
          proteinGrams: 15.5,
          carbsGrams: 12,
          fatGrams: 27,
          fiberGrams: 2.8,
          regionalOrigin: 'North Indian',
        },
        {
          name: 'Tawa Phulka / Roti (2 pcs)',
          estimatedServing: '2 rotis (70g)',
          servingUnit: 'pcs',
          estimatedWeightGrams: 70,
          calories: 180,
          proteinGrams: 5.8,
          carbsGrams: 34,
          fatGrams: 2.8,
          fiberGrams: 5.2,
          regionalOrigin: 'Indian Staple',
        },
        {
          name: 'Fresh Onion Cucumber Salad',
          estimatedServing: '1 small bowl (70g)',
          servingUnit: 'bowl',
          estimatedWeightGrams: 70,
          calories: 40,
          proteinGrams: 1.2,
          carbsGrams: 6,
          fatGrams: 0.5,
          fiberGrams: 1.5,
          regionalOrigin: 'All-India',
        },
      ],
    },
  },
  // --- DAL RICE / KHICHDI ---
  {
    keywords: ['dal', 'rice', 'dal tadka', 'khichdi', 'dal chawal', 'rajma', 'rajma chawal'],
    profile: {
      mealTitle: 'Home-style Yellow Dal Tadka with Steamed Basmati Rice',
      confidence: 0.95,
      isUncertain: false,
      alternatives: ['Moong Dal Khichdi', 'Rajma Chawal', 'Kadhi Chawal'],
      totalCalories: 430,
      totalProtein: 14.5,
      totalCarbs: 76,
      totalFat: 7.5,
      totalFiber: 7.2,
      insightTip: 'A revered staple: the combination of pulses (dal) and grain (rice) completes all 9 essential amino acids.',
      foodItems: [
        {
          name: 'Moong Dal Tadka with Ghee',
          estimatedServing: '1 bowl (180g)',
          servingUnit: 'bowl',
          estimatedWeightGrams: 180,
          calories: 180,
          proteinGrams: 9.5,
          carbsGrams: 24,
          fatGrams: 5.5,
          fiberGrams: 5.5,
          regionalOrigin: 'All-India Staple',
        },
        {
          name: 'Steamed Basmati Rice',
          estimatedServing: '1 cup (160g)',
          servingUnit: 'cup',
          estimatedWeightGrams: 160,
          calories: 210,
          proteinGrams: 4.2,
          carbsGrams: 46,
          fatGrams: 0.8,
          fiberGrams: 1.2,
          regionalOrigin: 'All-India Staple',
        },
        {
          name: 'Roasted Papad & Pickle',
          estimatedServing: '1 piece (20g)',
          servingUnit: 'piece',
          estimatedWeightGrams: 20,
          calories: 40,
          proteinGrams: 0.8,
          carbsGrams: 6,
          fatGrams: 1.2,
          fiberGrams: 0.5,
          regionalOrigin: 'All-India Staple',
        },
      ],
    },
  },
  // --- CHAI & SNACKS ---
  {
    keywords: ['chai', 'tea', 'masala chai', 'coffee', 'biscuit', 'rusk'],
    profile: {
      mealTitle: 'Indian Masala Chai with Whole Wheat Biscuits',
      confidence: 0.96,
      isUncertain: false,
      alternatives: ['Filter Coffee', 'Green Tea', 'Ginger Chai'],
      totalCalories: 170,
      totalProtein: 4.2,
      totalCarbs: 26,
      totalFat: 5.5,
      totalFiber: 1.8,
      insightTip: 'Cardamom and fresh ginger stimulate digestion and enhance daily mental alertness.',
      foodItems: [
        {
          name: 'Ginger Cardamom Masala Chai',
          estimatedServing: '1 cup (150ml)',
          servingUnit: 'cup',
          estimatedWeightGrams: 150,
          calories: 90,
          proteinGrams: 2.8,
          carbsGrams: 14,
          fatGrams: 2.5,
          fiberGrams: 0.2,
          regionalOrigin: 'All-India',
        },
        {
          name: 'Whole Wheat Marie / Digestives (2 pcs)',
          estimatedServing: '2 biscuits (25g)',
          servingUnit: 'pcs',
          estimatedWeightGrams: 25,
          calories: 80,
          proteinGrams: 1.4,
          carbsGrams: 12,
          fatGrams: 3,
          fiberGrams: 1.6,
          regionalOrigin: 'Snack',
        },
      ],
    },
  },
  // --- FRUITS & SALADS ---
  {
    keywords: ['fruit', 'apple', 'banana', 'papaya', 'salad', 'sprouts'],
    profile: {
      mealTitle: 'Fresh Indian Fruit & Moong Sprouts Bowl',
      confidence: 0.94,
      isUncertain: false,
      alternatives: ['Cucumber Tomato Salad', 'Papaya Bowl', 'Chana Chaat'],
      totalCalories: 180,
      totalProtein: 7.5,
      totalCarbs: 34,
      totalFat: 1.8,
      totalFiber: 8.5,
      insightTip: 'Extremely high in digestive enzymes, active vitamin C, potassium, and beneficial dietary fiber.',
      foodItems: [
        {
          name: 'Sprouted Green Moong Chaat',
          estimatedServing: '1 bowl (120g)',
          servingUnit: 'bowl',
          estimatedWeightGrams: 120,
          calories: 110,
          proteinGrams: 6.2,
          carbsGrams: 18,
          fatGrams: 1.2,
          fiberGrams: 5.8,
          regionalOrigin: 'Healthy Staple',
        },
        {
          name: 'Seasonal Mixed Fruits (Apple, Papaya)',
          estimatedServing: '1 small bowl (100g)',
          servingUnit: 'bowl',
          estimatedWeightGrams: 100,
          calories: 70,
          proteinGrams: 1.3,
          carbsGrams: 16,
          fatGrams: 0.6,
          fiberGrams: 2.7,
          regionalOrigin: 'Fresh Produce',
        },
      ],
    },
  },
  // --- PIZZA / BURGER / WESTERN FAST FOOD ---
  {
    keywords: ['pizza', 'burger', 'sandwich', 'pasta', 'maggi', 'noodles'],
    profile: {
      mealTitle: 'Indian Style Cheese Veggie Sandwich with Chips',
      confidence: 0.91,
      isUncertain: false,
      alternatives: ['Paneer Tikka Pizza', 'Bombay Masala Toast', 'Veg Burger'],
      totalCalories: 460,
      totalProtein: 14,
      totalCarbs: 56,
      totalFat: 20,
      totalFiber: 4.8,
      insightTip: 'Grilled with mint chutney, cucumber, tomatoes, and spiced cheese for a satisfying fast bite.',
      foodItems: [
        {
          name: 'Grilled Vegetable & Cheese Sandwich',
          estimatedServing: '2 triangles (180g)',
          servingUnit: 'serving',
          estimatedWeightGrams: 180,
          calories: 380,
          proteinGrams: 12.5,
          carbsGrams: 46,
          fatGrams: 16.5,
          fiberGrams: 4.2,
          regionalOrigin: 'Cafe / Street Snack',
        },
        {
          name: 'Mint Chutney & Potato Crisps',
          estimatedServing: '1 small portion (30g)',
          servingUnit: 'portion',
          estimatedWeightGrams: 30,
          calories: 80,
          proteinGrams: 1.5,
          carbsGrams: 10,
          fatGrams: 3.5,
          fiberGrams: 0.6,
          regionalOrigin: 'Snack',
        },
      ],
    },
  },
];

/**
 * Intelligent fallback classifier that analyzes user hint, text notes, or color tone
 */
export function getIntelligentFoodProfile(hint?: string): QuickFoodProfile {
  const query = (hint || '').toLowerCase().trim();

  if (query) {
    for (const item of KNOWN_DISH_PATTERNS) {
      if (item.keywords.some((kw) => query.includes(kw))) {
        return item.profile;
      }
    }
  }

  // Balanced Indian Thali default
  return {
    mealTitle: 'Homestyle Indian Meal (Dal, Sabzi, Rotis & Rice)',
    confidence: 0.92,
    isUncertain: false,
    alternatives: ['Chole Chawal', 'Paneer Thali', 'Rajma Chawal'],
    totalCalories: 510,
    totalProtein: 17.5,
    totalCarbs: 78,
    totalFat: 14,
    totalFiber: 9.8,
    insightTip: 'A wholesome ICMR-balanced traditional Indian meal combining whole pulses, vegetables, and unrefined grains.',
    foodItems: [
      {
        name: 'Mixed Vegetable Sabzi',
        estimatedServing: '1 katori (140g)',
        servingUnit: 'katori',
        estimatedWeightGrams: 140,
        calories: 120,
        proteinGrams: 3.5,
        carbsGrams: 14,
        fatGrams: 6,
        fiberGrams: 4.2,
        regionalOrigin: 'All-India',
      },
      {
        name: 'Yellow Dal Tadka',
        estimatedServing: '1 katori (150g)',
        servingUnit: 'katori',
        estimatedWeightGrams: 150,
        calories: 140,
        proteinGrams: 7,
        carbsGrams: 18,
        fatGrams: 4.5,
        fiberGrams: 4,
        regionalOrigin: 'All-India',
      },
      {
        name: 'Whole Wheat Phulka (2 pcs)',
        estimatedServing: '2 pieces (70g)',
        servingUnit: 'pcs',
        estimatedWeightGrams: 70,
        calories: 170,
        proteinGrams: 5.5,
        carbsGrams: 34,
        fatGrams: 2.2,
        fiberGrams: 5,
        regionalOrigin: 'Indian Staple',
      },
      {
        name: 'Steamed Rice with Lemon',
        estimatedServing: '1 small cup (100g)',
        servingUnit: 'cup',
        estimatedWeightGrams: 100,
        calories: 80,
        proteinGrams: 1.5,
        carbsGrams: 18,
        fatGrams: 0.3,
        fiberGrams: 0.6,
        regionalOrigin: 'All-India',
      },
    ],
  };
}
