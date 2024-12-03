"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { NutritionGenerator } from "./nutrition-generator";
import { Apple, History, Target, Utensils } from "lucide-react";

export function NutritionDashboard() {
  const [isGenerating, setIsGenerating] = useState(false);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Apple className="h-5 w-5" />
            Daily Calories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">2,100</div>
          <p className="text-sm text-muted-foreground">Target intake</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Weekly Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">5/7</div>
          <p className="text-sm text-muted-foreground">Days on track</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Last Meal Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold">High Protein Plan</div>
          <p className="text-sm text-muted-foreground">1 day ago</p>
        </CardContent>
      </Card>

      <Dialog>
        <DialogTrigger asChild>
          <Button size="lg" className="md:col-span-3">
            Generate New Meal Plan
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Generate Meal Plan</DialogTitle>
          </DialogHeader>
          <NutritionGenerator onGenerate={() => setIsGenerating(true)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}