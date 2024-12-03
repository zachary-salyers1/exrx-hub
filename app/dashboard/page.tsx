"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardMetrics } from '@/components/dashboard/metrics';
import { WelcomeHero } from '@/components/dashboard/welcome-hero';
import { UpcomingActivities } from '@/components/dashboard/upcoming-activities';
import { useAuth } from '@/components/auth/auth-provider';

export default function DashboardPage() {
  const { user, profile, loading } = useAuth();
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
      <WelcomeHero profile={profile} />
      <DashboardMetrics />
      <UpcomingActivities />
    </div>
  );
}