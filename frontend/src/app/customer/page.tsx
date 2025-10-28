"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services/auth.service";
import apiClient from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  User,
  Calendar,
  Ticket,
  CreditCard,
  ShoppingBag,
  Settings,
  MapPin,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';

type ProfileResponse = {
  success: boolean;
  data: any;
};

const StatsCard = ({ title, value, icon: Icon, iconColor }: { title: string; value: string | number; icon: any; iconColor: string }) => (
  <Card>
    <CardContent className="pt-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-lg bg-gray-50`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function CustomerDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const [fetching, setFetching] = React.useState(true);
  const [profile, setProfile] = React.useState<any>(null);

  React.useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.replace("/login");
        return;
      }
      load();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, isAuthenticated]);

  const load = async () => {
    try {
      setFetching(true);
      const res = await apiClient.get<ProfileResponse>("/auth/profile");
      setProfile(res.data.data);
    } catch (e: any) {
      console.error("Failed to load profile", e);
    } finally {
      setFetching(false);
    }
  };

  const formatDate = (d?: string | Date) => {
    if (!d) return "—";
    const dt = typeof d === "string" ? new Date(d) : d;
    if (Number.isNaN(dt.getTime())) return String(d);
    return dt.toLocaleDateString();
  };

  const membership = React.useMemo(() => {
    const annualPass = profile?.annual_pass as "yes" | "no" | undefined;
    const status = annualPass === "yes" ? "Active" : "None";
    const detail = annualPass === "yes" ? "Annual Pass" : "No membership";
    return { status, detail };
  }, [profile]);

  if (loading || fetching) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark_spring_green-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const firstName = profile?.customer_first_name || user?.first_name || 'Guest';

  const recentActivity = [
    {
      id: 1,
      icon: Ticket,
      iconColor: 'text-sea_green-600',
      title: 'Ticket Purchase',
      description: 'Adult ticket for Nov 2, 2025',
      time: '2 days ago',
    },
    {
      id: 2,
      icon: Calendar,
      iconColor: 'text-persian_orange-600',
      title: 'Event Registration',
      description: 'Registered for Dolphin Performance',
      time: '1 week ago',
    },
    {
      id: 3,
      icon: CreditCard,
      iconColor: 'text-dark_spring_green-600',
      title: 'Membership Renewed',
      description: 'Annual Pass extended to Oct 2026',
      time: '2 weeks ago',
    },
  ];

  const quickActions = [
    { href: '/tickets', icon: Ticket, label: 'Buy Tickets', description: 'Purchase tickets for your visit' },
    { href: '/events', icon: Calendar, label: 'Browse Events', description: 'View upcoming zoo events' },
    { href: '/customer/profile', icon: Settings, label: 'Edit Profile', description: 'Update your account details' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {firstName}!</h1>
        <p className="text-gray-600 mt-1">Your customer dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Membership Status"
          value={membership.status}
          icon={CreditCard}
          iconColor="text-dark_spring_green-600"
        />
        <StatsCard
          title="Tickets Purchased"
          value={3}
          icon={Ticket}
          iconColor="text-sea_green-600"
        />
        <StatsCard
          title="Events Registered"
          value={2}
          icon={Calendar}
          iconColor="text-persian_orange-600"
        />
        <StatsCard
          title="Total Visits"
          value={8}
          icon={MapPin}
          iconColor="text-dark_spring_green-600"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-dark_spring_green-600" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className={`p-2 rounded-lg bg-gray-50`}>
                      <Icon className={`h-4 w-4 ${activity.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-600 mt-0.5">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ShoppingBag className="h-5 w-5 text-dark_spring_green-600" />
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link key={action.href} href={action.href}>
                    <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-gray-300 hover:border-dark_spring_green-400 hover:bg-dark_spring_green-50 transition-all cursor-pointer group shadow-sm hover:shadow-md">
                      <div className="p-2 rounded-lg bg-dark_spring_green-100 group-hover:bg-dark_spring_green-200 transition-colors">
                        <Icon className="h-5 w-5 text-dark_spring_green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 group-hover:text-dark_spring_green-700">
                          {action.label}
                        </p>
                        <p className="text-xs text-gray-600">{action.description}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Membership Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5 text-dark_spring_green-600" />
            <span>Membership Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Status</p>
              <p className="text-xl font-bold text-gray-900 mt-1">{membership.status}</p>
              <p className="text-sm text-gray-600 mt-1">{membership.detail}</p>
            </div>
            <div>
              {membership.status === "None" ? (
                <Button onClick={() => router.push("/membership")}>Get Membership</Button>
              ) : (
                <Button onClick={() => router.push("/membership/confirmation")} variant="outline">Manage Membership</Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
