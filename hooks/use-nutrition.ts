"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getNutritionPlans, saveNutritionPlan, completeNutritionPlan, updateNutritionPlan as updateNutritionPlanApi, deleteNutritionPlan } from '@/lib/supabase-client';
import { useToast } from '@/components/ui/use-toast';

export function useNutrition() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: nutritionPlans, isLoading } = useQuery({
    queryKey: ['nutrition-plans'],
    queryFn: getNutritionPlans,
  });

  const createPlan = useMutation({
    mutationFn: saveNutritionPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nutrition-plans'] });
      toast({
        title: "Success",
        description: "Nutrition plan saved successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save nutrition plan. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updatePlan = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) =>
      updateNutritionPlanApi(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nutrition-plans'] });
      toast({
        title: "Success",
        description: "Nutrition plan updated successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update nutrition plan. Please try again.",
        variant: "destructive",
      });
    },
  });

  const markAsComplete = useMutation({
    mutationFn: completeNutritionPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nutrition-plans'] });
      toast({
        title: "Success",
        description: "Great job! Your nutrition plan has been marked as complete.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to complete nutrition plan. Please try again.",
        variant: "destructive",
      });
    },
  });

  const removePlan = useMutation({
    mutationFn: deleteNutritionPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nutrition-plans'] });
      toast({
        title: "Success",
        description: "Nutrition plan deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete nutrition plan. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    nutritionPlans,
    isLoading,
    createPlan,
    updatePlan,
    markAsComplete,
    removePlan,
  };
}