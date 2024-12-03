"use client";

import Groq from 'groq-sdk';

let groqClient: Groq | null = null;

const FALLBACK_WORKOUT = {
  title: "Full Body Strength Training",
  description: "A comprehensive full-body workout focusing on major muscle groups",
  exercises: [
    {
      name: "Push-ups",
      sets: 3,
      reps: 12,
      notes: "Keep core tight, lower chest to ground"
    },
    {
      name: "Bodyweight Squats",
      sets: 3,
      reps: 15,
      notes: "Keep weight in heels, knees tracking over toes"
    },
    {
      name: "Dumbbell Rows",
      sets: 3,
      reps: 12,
      notes: "Keep back straight, squeeze shoulder blades"
    },
    {
      name: "Plank Hold",
      sets: 3,
      reps: 30,
      notes: "Hold position for 30 seconds, maintain straight line from head to heels"
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

export async function generateWorkout(params: {
  type: string;
  difficulty: string;
  duration: number;
  equipment: string[];
}) {
  const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
  
  if (!apiKey) {
    console.warn('GROQ API key not found, using fallback workout');
    return FALLBACK_WORKOUT;
  }

  try {
    if (!groqClient) {
      initGroq(apiKey);
    }

    if (!groqClient) {
      throw new Error('Failed to initialize GROQ client');
    }

    const prompt = `Create a ${params.difficulty} level ${params.type} workout that takes ${params.duration} minutes.
Available equipment: ${params.equipment.join(', ')}.

Return a workout plan in this exact JSON format:
{
  "title": "string",
  "description": "string",
  "exercises": [
    {
      "name": "string",
      "sets": number,
      "reps": number,
      "notes": "string"
    }
  ]
}

Rules:
1. Use ONLY the exact JSON structure shown above
2. All numbers must be actual numbers, not strings or ranges
3. All text must be in English
4. Keep exercise names simple and clear
5. Include 4-6 exercises
6. Provide specific rep counts, not ranges
7. Notes should be clear and concise instructions`;

    const completion = await groqClient.chat.completions.create({
      messages: [
        { 
          role: 'system', 
          content: 'You are a professional fitness trainer. Always respond with valid JSON following the exact format requested. Do not include any additional text or markdown formatting.'
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
      console.warn('No response from GROQ API, using fallback workout');
      return FALLBACK_WORKOUT;
    }

    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }

      const workout = JSON.parse(jsonMatch[0]);
      
      // Validate the workout structure
      if (!workout.title || typeof workout.title !== 'string') {
        throw new Error('Invalid workout title');
      }
      if (!workout.description || typeof workout.description !== 'string') {
        throw new Error('Invalid workout description');
      }
      if (!Array.isArray(workout.exercises) || workout.exercises.length === 0) {
        throw new Error('Invalid exercises array');
      }

      // Validate each exercise
      workout.exercises.forEach((exercise: any, index: number) => {
        if (!exercise.name || typeof exercise.name !== 'string') {
          throw new Error(`Invalid exercise name at index ${index}`);
        }
        if (typeof exercise.sets !== 'number' || exercise.sets <= 0) {
          throw new Error(`Invalid sets value at index ${index}`);
        }
        if (typeof exercise.reps !== 'number' || exercise.reps <= 0) {
          throw new Error(`Invalid reps value at index ${index}`);
        }
        if (!exercise.notes || typeof exercise.notes !== 'string') {
          throw new Error(`Invalid notes at index ${index}`);
        }
      });

      return workout;
    } catch (parseError: any) {
      console.warn('Failed to parse workout data:', parseError);
      return FALLBACK_WORKOUT;
    }
  } catch (error: any) {
    console.warn('Error generating workout:', error);
    return FALLBACK_WORKOUT;
  }
}