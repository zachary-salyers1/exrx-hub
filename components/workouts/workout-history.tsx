"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Activity, CheckCircle2, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { useWorkouts } from "@/hooks/use-workouts";
import { WorkoutDetails } from "./workout-details";

export function WorkoutHistory() {
  const { workouts, isLoading, markAsComplete, updateWorkout, removeWorkout } = useWorkouts();
  const [expandedWorkout, setExpandedWorkout] = useState<string | null>(null);
  const [workoutToDelete, setWorkoutToDelete] = useState<string | null>(null);
  const [completingWorkout, setCompletingWorkout] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCompleteWorkout = async (workoutId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (completingWorkout) return;

    try {
      setCompletingWorkout(workoutId);
      await markAsComplete.mutateAsync(workoutId);
    } catch (error) {
      console.error('Error completing workout:', error);
      toast({
        title: "Error",
        description: "Failed to complete workout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCompletingWorkout(null);
    }
  };

  const handleDeleteWorkout = async () => {
    if (!workoutToDelete) return;

    try {
      await removeWorkout.mutateAsync(workoutToDelete);
      setWorkoutToDelete(null);
    } catch (error) {
      console.error('Error deleting workout:', error);
      toast({
        title: "Error",
        description: "Failed to delete workout. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Workouts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>Loading workouts...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Recent Workouts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workouts?.map((workout) => (
              <div key={workout.id} className="space-y-2">
                <div
                  className="flex items-center justify-between rounded-lg border p-4 cursor-pointer hover:bg-accent"
                  onClick={() => setExpandedWorkout(expandedWorkout === workout.id ? null : workout.id)}
                >
                  <div className="flex items-center space-x-4">
                    <div className={cn(
                      "rounded-full p-2",
                      workout.completed ? "bg-green-500/10" : "bg-primary/10"
                    )}>
                      <Activity className={cn(
                        "h-4 w-4",
                        workout.completed ? "text-green-500" : "text-primary"
                      )} />
                    </div>
                    <div>
                      <p className="font-medium">{workout.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(workout.created_at), 'PPP')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {workout.completed ? (
                      <div className="flex items-center text-green-500">
                        <CheckCircle2 className="h-5 w-5 mr-2" />
                        <span className="text-sm font-medium">Completed</span>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={completingWorkout === workout.id}
                        onClick={(e) => handleCompleteWorkout(workout.id, e)}
                        className={cn(
                          "transition-colors",
                          completingWorkout === workout.id
                            ? "text-muted-foreground"
                            : "hover:bg-green-50 hover:text-green-600 hover:border-green-600"
                        )}
                      >
                        {completingWorkout === workout.id ? "Completing..." : "Complete"}
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive/90"
                      onClick={(e) => {
                        e.stopPropagation();
                        setWorkoutToDelete(workout.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    {expandedWorkout === workout.id ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </div>
                </div>
                {expandedWorkout === workout.id && (
                  <WorkoutDetails
                    workout={workout}
                    onComplete={handleCompleteWorkout}
                    onUpdate={(id, updates) => updateWorkout.mutate({ id, updates })}
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={!!workoutToDelete} onOpenChange={() => setWorkoutToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Workout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this workout? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteWorkout}
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