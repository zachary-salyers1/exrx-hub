"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getWorkouts, saveWorkout, completeWorkout, updateWorkout as updateWorkoutApi, deleteWorkout } from '@/lib/supabase-client';
import { useToast } from '@/components/ui/use-toast';

export function useWorkouts() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: workouts, isLoading } = useQuery({
    queryKey: ['workouts'],
    queryFn: getWorkouts,
  });

  const createWorkout = useMutation({
    mutationFn: saveWorkout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
      toast({
        title: "Success",
        description: "Workout saved successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save workout. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateWorkout = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) =>
      updateWorkoutApi(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
      toast({
        title: "Success",
        description: "Workout updated successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update workout. Please try again.",
        variant: "destructive",
      });
    },
  });

  const markAsComplete = useMutation({
    mutationFn: completeWorkout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
      toast({
        title: "Success",
        description: "Great job! Your workout has been marked as complete.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to complete workout. Please try again.",
        variant: "destructive",
      });
    },
  });

  const removeWorkout = useMutation({
    mutationFn: deleteWorkout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
      toast({
        title: "Success",
        description: "Workout deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete workout. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    workouts,
    isLoading,
    createWorkout,
    updateWorkout,
    markAsComplete,
    removeWorkout,
  };
}