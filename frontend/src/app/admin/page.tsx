"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { dashboardService } from '@/services/dashboard.service';
import { DashboardStats } from '@/types';
import { StatsCard } from '@/components/admin/StatsCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Leaf,
  Users,
  Calendar,
  MapPin,
  UserCircle,
  DollarSign,
  Plus,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalAnimals: 0,
    totalEmployees: 0,
    upcomingEvents: 0,
    activeHabitats: 0,
    todaysVisitors: 0,
    monthlyRevenue: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);



  useEffect(() => {
    if (isAuthenticated) {
      loadStats();
    }
  }, [isAuthenticated]);

  const loadStats = async () => {
    try {
      setStatsLoading(true);
      const data = await dashboardService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  if (loading || statsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark_spring_green-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const recentActivities = [
    {
      id: 1,
      icon: Leaf,
      iconColor: 'text-sea_green-600',
      title: 'New animal added',
      description: 'Mango the Bengal Tiger was added to Tropical Forest',
      time: '2 hours ago',
    },
    {
      id: 2,
      icon: Calendar,
      iconColor: 'text-persian_orange-600',
      title: 'Event scheduled',
      description: 'Dolphin Performance scheduled for Oct 17',
      time: '5 hours ago',
    },
    {
      id: 3,
      icon: Users,
      iconColor: 'text-dark_spring_green-600',
      title: 'New employee onboarded',
      description: 'Emma Davis joined as Zookeeper',
      time: '1 day ago',
    },
  ];

  const quickActions = [
    { href: '/admin/animals', icon: Leaf, label: 'Add New Animal', description: 'Register a new animal to the zoo' },
    { href: '/admin/events', icon: Calendar, label: 'Schedule Event', description: 'Create a new zoo event' },
    { href: '/admin/employees', icon: Users, label: 'Add Employee', description: 'Onboard a new team member' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">Welcome to Zoo Admin Dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard
          title="Total Animals"
          value={stats.totalAnimals}
          icon={Leaf}
          iconColor="text-sea_green-600"
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Total Employees"
          value={stats.totalEmployees}
          icon={Users}
          iconColor="text-dark_spring_green-600"
          trend={{ value: 3, isPositive: true }}
        />
        <StatsCard
          title="Upcoming Events"
          value={stats.upcomingEvents}
          icon={Calendar}
          iconColor="text-persian_orange-600"
        />
        <StatsCard
          title="Active Habitats"
          value={stats.activeHabitats}
          icon={MapPin}
          iconColor="text-sea_green-600"
        />
        <StatsCard
          title="Today's Visitors"
          value={stats.todaysVisitors}
          icon={UserCircle}
          iconColor="text-dark_spring_green-600"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Monthly Revenue"
          value={`$${stats.monthlyRevenue.toLocaleString()}`}
          icon={DollarSign}
          iconColor="text-persian_orange-600"
          trend={{ value: 15, isPositive: true }}
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
              {recentActivities.map((activity) => {
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
              <Plus className="h-5 w-5 text-dark_spring_green-600" />
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
    </div>
  );
}
