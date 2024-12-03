"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Edit2, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NutritionPlan } from "@/types/nutrition";

interface NutritionPlanDetailsProps {
  plan: NutritionPlan;
  onComplete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<NutritionPlan>) => void;
}

export function NutritionPlanDetails({ plan, onComplete, onUpdate }: NutritionPlanDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMeals, setEditedMeals] = useState(plan.meals);

  const handleMealUpdate = (index: number, field: string, value: any) => {
    const updatedMeals = [...editedMeals];
    updatedMeals[index] = {
      ...updatedMeals[index],
      [field]: value,
    };
    setEditedMeals(updatedMeals);
  };

  const handleSave = () => {
    onUpdate(plan.id, { meals: editedMeals });
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{plan.title}</CardTitle>
        <div className="flex gap-2">
          {!plan.completed && (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? <X className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onComplete(plan.id)}
                className={cn(
                  "transition-colors",
                  "hover:bg-green-50 hover:text-green-600 hover:border-green-600"
                )}
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Label>Daily Calorie Target</Label>
              <div className="text-2xl font-bold">{plan.calories_target}</div>
            </div>
            <div>
              <Label>Plan Type</Label>
              <div className="text-2xl font-bold capitalize">{plan.type.replace('_', ' ')}</div>
            </div>
          </div>

          {editedMeals.map((meal, index) => (
            <div key={index} className="space-y-4 border-t pt-4">
              <div className="font-medium text-lg">{meal.name}</div>
              
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label>Calories</Label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={meal.calories}
                      onChange={(e) =>
                        handleMealUpdate(index, "calories", parseInt(e.target.value))
                      }
                    />
                  ) : (
                    <div className="text-sm">{meal.calories}</div>
                  )}
                </div>
                <div>
                  <Label>Protein (g)</Label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={meal.protein}
                      onChange={(e) =>
                        handleMealUpdate(index, "protein", parseInt(e.target.value))
                      }
                    />
                  ) : (
                    <div className="text-sm">{meal.protein}</div>
                  )}
                </div>
                <div>
                  <Label>Carbs (g)</Label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={meal.carbs}
                      onChange={(e) =>
                        handleMealUpdate(index, "carbs", parseInt(e.target.value))
                      }
                    />
                  ) : (
                    <div className="text-sm">{meal.carbs}</div>
                  )}
                </div>
                <div>
                  <Label>Fats (g)</Label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={meal.fats}
                      onChange={(e) =>
                        handleMealUpdate(index, "fats", parseInt(e.target.value))
                      }
                    />
                  ) : (
                    <div className="text-sm">{meal.fats}</div>
                  )}
                </div>
              </div>

              <div>
                <Label>Ingredients</Label>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {meal.ingredients.map((ingredient, i) => (
                    <li key={i}>{ingredient}</li>
                  ))}
                </ul>
              </div>

              {meal.instructions && (
                <div>
                  <Label>Instructions</Label>
                  <p className="text-sm text-muted-foreground">{meal.instructions}</p>
                </div>
              )}
            </div>
          ))}

          {isEditing && (
            <Button onClick={handleSave} className="w-full">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}