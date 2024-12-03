"use client";

import Groq from 'groq-sdk';
import type { Meal } from '@/types/nutrition';

let groqClient: Groq | null = null;

const FALLBACK_NUTRITION_PLAN = {
  title: "Balanced Meal Plan",
  description: "A balanced meal plan focusing on whole foods and proper macronutrient distribution",
  calories_target: 2000,
  meals: [
    {
      name: "Breakfast",
      calories: 500,
      protein: 25,
      carbs: 60,
      fats: 20,
      ingredients: [
        "2 whole eggs",
        "1 cup oatmeal",
        "1 banana",
        "1 tbsp honey",
        "1 cup almond milk"
      ],
      instructions: "1. Cook oatmeal with almond milk. 2. Prepare eggs to preference. 3. Slice banana and add honey."
    },
    {
      name: "Lunch",
      calories: 600,
      protein: 40,
      carbs: 65,
      fats: 25,
      ingredients: [
        "6 oz chicken breast",
        "1 cup brown rice",
        "2 cups mixed vegetables",
        "1 tbsp olive oil"
      ],
      instructions: "1. Grill chicken breast. 2. Cook rice. 3. Steam vegetables and season with olive oil."
    },
    {
      name: "Dinner",
      calories: 550,
      protein: 35,
      carbs: 50,
      fats: 25,
      ingredients: [
        "5 oz salmon",
        "1 cup quinoa",
        "1 cup roasted broccoli",
        "1 tbsp coconut oil"
      ],
      instructions: "1. Bake salmon. 2. Cook quinoa. 3. Roast broccoli with coconut oil."
    }
  ]
};

export function initGroq(apiKey: string) {
  if (!groqClient && apiKey) {
    groqClient = new Groq({ 
      apiKey,
      dangerouslyAllowBrowser: true
    });
  }
  return groqClient;
}

export async function generateNutritionPlan(params: {
  type: string;
  calorieTarget: number;
  dietaryRestrictions: string[];
  mealsPerDay: number;
}) {
  const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
  
  if (!apiKey) {
    console.warn('GROQ API key not found, using fallback nutrition plan');
    return FALLBACK_NUTRITION_PLAN;
  }

  try {
    if (!groqClient) {
      initGroq(apiKey);
    }

    if (!groqClient) {
      throw new Error('Failed to initialize GROQ client');
    }

    const prompt = `Create a ${params.type} meal plan with ${params.mealsPerDay} meals totaling ${params.calorieTarget} calories.
Dietary restrictions: ${params.dietaryRestrictions.join(', ') || 'None'}.

Return a meal plan in this exact JSON format:
{
  "title": "Plan Title",
  "description": "Brief plan description",
  "calories_target": ${params.calorieTarget},
  "meals": [
    {
      "name": "Meal Name",
      "calories": number,
      "protein": number,
      "carbs": number,
      "fats": number,
      "ingredients": ["ingredient 1", "ingredient 2"],
      "instructions": "Cooking instructions"
    }
  ]
}

Rules:
1. Use ONLY the exact JSON structure shown above
2. All numbers must be actual numbers, not strings
3. All text must be in English
4. Keep meal names simple and clear
5. Include exactly ${params.mealsPerDay} meals
6. Total calories across all meals should sum to approximately ${params.calorieTarget}
7. Include practical portions and measurements
8. Respect all dietary restrictions`;

    const completion = await groqClient.chat.completions.create({
      messages: [
        { 
          role: 'system', 
          content: 'You are a professional nutritionist. Always respond with valid JSON following the exact format requested. Do not include any additional text or markdown formatting.'
        },
        { 
          role: 'user', 
          content: prompt 
        }
      ],
      model: 'mixtral-8x7b-32768',
      temperature: 0.3,
      max_tokens: 1024,
      response_format: { type: "json_object" },
      stream: false
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      console.warn('No response from GROQ API, using fallback nutrition plan');
      return FALLBACK_NUTRITION_PLAN;
    }

    try {
      const plan = JSON.parse(content);
      
      // Validate the plan structure
      if (!plan.title || typeof plan.title !== 'string') {
        throw new Error('Invalid plan title');
      }
      if (!plan.description || typeof plan.description !== 'string') {
        throw new Error('Invalid plan description');
      }
      if (!Array.isArray(plan.meals) || plan.meals.length !== params.mealsPerDay) {
        throw new Error('Invalid meals array');
      }

      // Validate each meal
      plan.meals.forEach((meal: Meal, index: number) => {
        if (!meal.name || typeof meal.name !== 'string') {
          throw new Error(`Invalid meal name at index ${index}`);
        }
        if (typeof meal.calories !== 'number' || meal.calories <= 0) {
          throw new Error(`Invalid calories value at index ${index}`);
        }
        if (!Array.isArray(meal.ingredients) || meal.ingredients.length === 0) {
          throw new Error(`Invalid ingredients array at index ${index}`);
        }
      });

      return {
        ...plan,
        calories_target: params.calorieTarget // Ensure we use the target from params
      };
    } catch (parseError: any) {
      console.warn('Failed to parse nutrition plan data:', parseError);
      return FALLBACK_NUTRITION_PLAN;
    }
  } catch (error: any) {
    console.warn('Error generating nutrition plan:', error);
    return FALLBACK_NUTRITION_PLAN;
  }
}