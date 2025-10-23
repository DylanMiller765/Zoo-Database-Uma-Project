import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const getBorderColor = (iconColor: string) => {
  const colorMap: Record<string, string> = {
    'text-sea_green-600': 'border-l-sea_green-500',
    'text-dark_spring_green-600': 'border-l-dark_spring_green-500',
    'text-persian_orange-600': 'border-l-persian_orange-500',
  };
  return colorMap[iconColor] || 'border-l-dark_spring_green-500';
};

const getIconBgColor = (iconColor: string) => {
  const colorMap: Record<string, string> = {
    'text-sea_green-600': 'bg-sea_green-100',
    'text-dark_spring_green-600': 'bg-dark_spring_green-100',
    'text-persian_orange-600': 'bg-persian_orange-100',
  };
  return colorMap[iconColor] || 'bg-dark_spring_green-100';
};

export function StatsCard({ title, value, icon: Icon, iconColor = "text-dark_spring_green-600", trend }: StatsCardProps) {
  return (
    <Card className={cn(
      "p-6 border-l-4 shadow-md hover:shadow-lg transition-all",
      getBorderColor(iconColor)
    )}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && (
            <p className={cn(
              "text-sm mt-2 flex items-center",
              trend.isPositive ? "text-emerald-600" : "text-red-600"
            )}>
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span className="ml-1">{Math.abs(trend.value)}%</span>
              <span className="ml-1 text-gray-600">vs last month</span>
            </p>
          )}
        </div>
        <div className={cn(
          "p-4 rounded-full",
          getIconBgColor(iconColor)
        )}>
          <Icon className={cn("h-7 w-7", iconColor)} />
        </div>
      </div>
    </Card>
  );
}
