"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Apple, CheckCircle2, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { useNutrition } from "@/hooks/use-nutrition";
import { NutritionPlanDetails } from "./nutrition-plan-details";

export function NutritionHistory() {
  const { nutritionPlans, isLoading, markAsComplete, updatePlan, removePlan } = useNutrition();
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);
  const [completingPlan, setCompletingPlan] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCompletePlan = async (planId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (completingPlan) return;

    try {
      setCompletingPlan(planId);
      await markAsComplete.mutateAsync(planId);
    } catch (error) {
      console.error('Error completing plan:', error);
      toast({
        title: "Error",
        description: "Failed to complete nutrition plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCompletingPlan(null);
    }
  };

  const handleDeletePlan = async () => {
    if (!planToDelete) return;

    try {
      await removePlan.mutateAsync(planToDelete);
      setPlanToDelete(null);
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast({
        title: "Error",
        description: "Failed to delete nutrition plan. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Meal Plans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>Loading meal plans...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Recent Meal Plans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {nutritionPlans?.map((plan) => (
              <div key={plan.id} className="space-y-2">
                <div
                  className="flex items-center justify-between rounded-lg border p-4 cursor-pointer hover:bg-accent"
                  onClick={() => setExpandedPlan(expandedPlan === plan.id ? null : plan.id)}
                >
                  <div className="flex items-center space-x-4">
                    <div className={cn(
                      "rounded-full p-2",
                      plan.completed ? "bg-green-500/10" : "bg-primary/10"
                    )}>
                      <Apple className={cn(
                        "h-4 w-4",
                        plan.completed ? "text-green-500" : "text-primary"
                      )} />
                    </div>
                    <div>
                      <p className="font-medium">{plan.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(plan.created_at), 'PPP')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {plan.completed ? (
                      <div className="flex items-center text-green-500">
                        <CheckCircle2 className="h-5 w-5 mr-2" />
                        <span className="text-sm font-medium">Completed</span>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={completingPlan === plan.id}
                        onClick={(e) => handleCompletePlan(plan.id, e)}
                        className={cn(
                          "transition-colors",
                          completingPlan === plan.id
                            ? "text-muted-foreground"
                            : "hover:bg-green-50 hover:text-green-600 hover:border-green-600"
                        )}
                      >
                        {completingPlan === plan.id ? "Completing..." : "Complete"}
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive/90"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPlanToDelete(plan.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    {expandedPlan === plan.id ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </div>
                </div>
                {expandedPlan === plan.id && (
                  <NutritionPlanDetails
                    plan={plan}
                    onComplete={handleCompletePlan}
                    onUpdate={(id, updates) => updatePlan.mutate({ id, updates })}
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={!!planToDelete} onOpenChange={() => setPlanToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Nutrition Plan</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this nutrition plan? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePlan}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}