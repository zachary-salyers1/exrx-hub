export type Meal = {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  ingredients: string[];
  instructions?: string;
};

export type NutritionPlan = {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  type: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'custom';
  calories_target: number;
  meals: Meal[];
  completed: boolean;
  completion_date?: string;
  created_at: string;
  updated_at: string;
};