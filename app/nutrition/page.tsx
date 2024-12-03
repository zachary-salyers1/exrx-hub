"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { NutritionDashboard } from "@/components/nutrition/nutrition-dashboard";
import { NutritionHistory } from "@/components/nutrition/nutrition-history";
import { useAuth } from '@/components/auth/auth-provider';

export default function NutritionPage() {
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
        <h1 className="text-3xl font-bold">Nutrition Plans</h1>
      </div>
      <NutritionDashboard />
      <NutritionHistory />
    </div>
  );
}