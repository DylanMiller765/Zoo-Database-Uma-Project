"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { dashboardService, RecentActivity } from '@/services/dashboard.service';
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
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);



  useEffect(() => {
    if (isAuthenticated) {
      loadStats();
      loadRecentActivity();
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

  const loadRecentActivity = async () => {
    try {
      setActivitiesLoading(true);
      const data = await dashboardService.getRecentActivity();
      setRecentActivities(data);
    } catch (error) {
      console.error('Failed to load recent activity:', error);
    } finally {
      setActivitiesLoading(false);
    }
  };

  const getTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const activityDate = new Date(timestamp);
    const diffMs = now.getTime() - activityDate.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return diffMins <= 1 ? '1 minute ago' : `${diffMins} minutes ago`;
    } else if (diffHours < 24) {
      return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
    } else {
      return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'animal':
        return Leaf;
      case 'event':
        return Calendar;
      case 'employee':
        return Users;
      default:
        return TrendingUp;
    }
  };

  const getActivityIconColor = (type: string): string => {
    switch (type) {
      case 'animal':
        return 'text-sea_green-600';
      case 'event':
        return 'text-persian_orange-600';
      case 'employee':
        return 'text-dark_spring_green-600';
      default:
        return 'text-gray-600';
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

  // Role-specific quick actions
  const getQuickActions = () => {
    const role = user?.job_role;

    // Cashier quick actions
    if (role === 'cashier') {
      return [
        { href: '/admin/tickets', icon: DollarSign, label: 'Sell Tickets', description: 'Process ticket sales' },
        { href: '/admin/customers', icon: UserCircle, label: 'Manage Customers', description: 'View and manage customer accounts' },
        { href: '/admin/gift-shops', icon: DollarSign, label: 'Gift Shop Sales', description: 'Process gift shop transactions' },
        { href: '/admin/cafes', icon: DollarSign, label: 'Café Sales', description: 'Process café transactions' },
      ];
    }

    // Guide quick actions
    if (role === 'guide') {
      return [
        { href: '/admin/events', icon: Calendar, label: 'View Events', description: 'Check upcoming zoo events' },
      ];
    }

    // Maintenance quick actions
    if (role === 'maintenance') {
      return [
        { href: '/admin/habitats', icon: MapPin, label: 'Habitat Maintenance', description: 'View habitat maintenance schedules' },
      ];
    }

    // Manager quick actions (full access)
    if (role === 'manager') {
      return [
        { href: '/admin/animals', icon: Leaf, label: 'Add New Animal', description: 'Register a new animal to the zoo' },
        { href: '/admin/events', icon: Calendar, label: 'Schedule Event', description: 'Create a new zoo event' },
        { href: '/admin/employees', icon: Users, label: 'Add Employee', description: 'Onboard a new team member' },
        { href: '/admin/gift-shops', icon: DollarSign, label: 'Gift Shops & Items', description: 'Manage shops and their items' },
        { href: '/admin/cafes', icon: DollarSign, label: 'Cafés & Menu Items', description: 'Manage cafés and their menus' },
      ];
    }

    // Keeper quick actions
    if (role === 'keeper') {
      return [
        { href: '/admin/animals', icon: Leaf, label: 'View Animals', description: 'Check animal information' },
        { href: '/admin/habitats', icon: MapPin, label: 'View Habitats', description: 'Check habitat information' },
      ];
    }

    // Veterinarian quick actions
    if (role === 'veterinarian') {
      return [
        { href: '/admin/animals', icon: Leaf, label: 'Animal Health', description: 'Manage animal health records' },
        { href: '/admin/habitats', icon: MapPin, label: 'View Habitats', description: 'Check habitat conditions' },
      ];
    }

    // Coordinator quick actions
    if (role === 'coordinator') {
      return [
        { href: '/admin/events', icon: Calendar, label: 'Manage Events', description: 'Create and manage zoo events' },
      ];
    }

    // Security quick actions
    if (role === 'security') {
      return [
        { href: '/admin/events', icon: Calendar, label: 'View Events', description: 'Monitor scheduled events' },
      ];
    }

    // Default quick actions for other roles (including 'other')
    return [];
  };

  const quickActions = getQuickActions();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">Welcome to Zoo Admin Dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Show relevant stats based on role */}
        {(user?.job_role === 'manager' || user?.job_role === 'keeper' || user?.job_role === 'veterinarian') && (
          <StatsCard
            title="Total Animals"
            value={stats.totalAnimals}
            icon={Leaf}
            iconColor="text-sea_green-600"
          />
        )}
        {user?.job_role === 'manager' && (
          <StatsCard
            title="Total Employees"
            value={stats.totalEmployees}
            icon={Users}
            iconColor="text-dark_spring_green-600"
          />
        )}
        {(user?.job_role === 'manager' || user?.job_role === 'coordinator' || user?.job_role === 'guide' || user?.job_role === 'security') && (
          <StatsCard
            title="Upcoming Events"
            value={stats.upcomingEvents}
            icon={Calendar}
            iconColor="text-persian_orange-600"
          />
        )}
        {(user?.job_role === 'manager' || user?.job_role === 'keeper' || user?.job_role === 'veterinarian' || user?.job_role === 'maintenance') && (
          <StatsCard
            title="Active Habitats"
            value={stats.activeHabitats}
            icon={MapPin}
            iconColor="text-sea_green-600"
          />
        )}
        {(user?.job_role === 'manager' || user?.job_role === 'cashier') && (
          <StatsCard
            title="Today's Visitors"
            value={stats.todaysVisitors}
            icon={UserCircle}
            iconColor="text-dark_spring_green-600"
          />
        )}
        {(user?.job_role === 'manager' || user?.job_role === 'cashier') && (
          <StatsCard
            title="Monthly Revenue"
            value={`$${stats.monthlyRevenue.toLocaleString()}`}
            icon={DollarSign}
            iconColor="text-persian_orange-600"
          />
        )}
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
            {activitiesLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dark_spring_green-600"></div>
              </div>
            ) : recentActivities.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No recent activity</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivities.map((activity, index) => {
                  const Icon = getActivityIcon(activity.type);
                  const iconColor = getActivityIconColor(activity.type);
                  return (
                    <div key={index} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className={`p-2 rounded-lg bg-gray-50`}>
                        <Icon className={`h-4 w-4 ${iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-sm text-gray-600 mt-0.5">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{getTimeAgo(activity.timestamp)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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
