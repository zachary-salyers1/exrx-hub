"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WorkoutDashboard } from "@/components/workouts/workout-dashboard";
import { WorkoutHistory } from "@/components/workouts/workout-history";
import { useAuth } from '@/components/auth/auth-provider';

export default function WorkoutsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [loading, user, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Workouts</h1>
      </div>
      <WorkoutDashboard />
      <WorkoutHistory />
    </div>
  );
}