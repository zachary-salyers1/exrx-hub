"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Pizza } from "lucide-react";
import Link from "next/link";
import type { UserProfile } from '@/types/user';

interface WelcomeHeroProps {
  profile: UserProfile | null;
}

export function WelcomeHero({ profile }: WelcomeHeroProps) {
  const hour = new Date().getHours();
  let greeting = "Good evening";
  if (hour < 12) greeting = "Good morning";
  else if (hour < 18) greeting = "Good afternoon";

  const firstName = profile?.full_name?.split(' ')[0] || 'there';

  return (
    <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-2">{greeting}, {firstName}!</h1>
        <p className="text-lg opacity-90 mb-6">
          Ready to continue your wellness journey?
        </p>
        <div className="flex flex-wrap gap-4">
          <Button asChild variant="secondary">
            <Link href="/workouts" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Start Workout
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/nutrition" className="flex items-center gap-2">
              <Pizza className="h-4 w-4" />
              Plan Meals
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}