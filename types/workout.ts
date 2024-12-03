export type Exercise = {
  name: string;
  sets: number;
  reps: number;
  notes?: string;
  weight?: number;
};

export type Workout = {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  type: 'strength' | 'cardio' | 'flexibility' | 'custom';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  exercises: Exercise[];
  completed: boolean;
  completion_date?: string;
  created_at: string;
  updated_at: string;
};