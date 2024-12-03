"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { generateNutritionPlan } from "@/lib/nutrition";
import { useNutrition } from "@/hooks/use-nutrition";
import { DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

const nutritionFormSchema = z.object({
  type: z.enum(["weight_loss", "muscle_gain", "maintenance", "custom"]),
  calorieTarget: z.number().min(1200).max(4000),
  mealsPerDay: z.number().min(3).max(6),
  dietaryRestrictions: z.array(z.string()),
});

type NutritionFormValues = z.infer<typeof nutritionFormSchema>;

const FALLBACK_PLAN = {
  title: "Balanced Meal Plan",
  description: "A balanced meal plan focusing on whole foods and proper macronutrient distribution",
  type: "maintenance" as const,
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

export function NutritionGenerator({ onGenerate }: { onGenerate: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const { createPlan } = useNutrition();
  const { toast } = useToast();

  const form = useForm<NutritionFormValues>({
    resolver: zodResolver(nutritionFormSchema),
    defaultValues: {
      type: "maintenance",
      calorieTarget: 2000,
      mealsPerDay: 3,
      dietaryRestrictions: [],
    },
  });

  async function onSubmit(data: NutritionFormValues) {
    setIsLoading(true);

    try {
      let plan;
      try {
        plan = await generateNutritionPlan({
          type: data.type,
          calorieTarget: data.calorieTarget,
          mealsPerDay: data.mealsPerDay,
          dietaryRestrictions: data.dietaryRestrictions,
        });
      } catch (error) {
        console.error('Error generating plan:', error);
        plan = FALLBACK_PLAN;
        toast({
          title: "Using Fallback Plan",
          description: "Could not generate custom plan. Using a pre-defined plan instead.",
        });
      }

      const planData = {
        title: plan.title,
        description: plan.description,
        type: data.type,
        calories_target: data.calorieTarget,
        meals: plan.meals,
        completed: false,
      };

      await createPlan.mutateAsync(planData);

      toast({
        title: "Success",
        description: "Nutrition plan saved successfully!",
      });

      onGenerate();
    } catch (error: any) {
      console.error('Error saving nutrition plan:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save nutrition plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plan Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select plan type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="weight_loss">Weight Loss</SelectItem>
                  <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="calorieTarget"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Daily Calorie Target: {field.value}</FormLabel>
              <FormControl>
                <Slider
                  min={1200}
                  max={4000}
                  step={50}
                  value={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mealsPerDay"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meals per Day: {field.value}</FormLabel>
              <FormControl>
                <Slider
                  min={3}
                  max={6}
                  step={1}
                  value={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <DialogClose asChild>
            <Button type="button" variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" className="flex-1" disabled={isLoading}>
            {isLoading ? "Generating..." : "Generate Plan"}
          </Button>
        </div>
      </form>
    </Form>
  );
}