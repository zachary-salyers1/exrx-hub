export type UserProfile = {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  height?: number;
  weight?: number;
  fitness_goal?: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'general_fitness';
  activity_level?: 'sedentary' | 'light' | 'moderate' | 'very_active' | 'extra_active';
  created_at?: string;
  updated_at?: string;
};