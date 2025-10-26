"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { queryService } from '@/services/query.service';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Calendar, Users } from 'lucide-react';

export default function EventAttendancePage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await queryService.getEventAttendance();
      setData(result);
    } catch (error) {
      console.error('Failed to load event attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark_spring_green-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const getCapacityBadge = (percentage: number | null) => {
    if (percentage === null) return 'default';
    if (percentage >= 90) return 'danger';
    if (percentage >= 70) return 'warning';
    if (percentage >= 50) return 'secondary';
    return 'success';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${month}/${day}/${year}`;
  };

  const formatTime = (timeString: string) => {
    // Remove seconds from time (HH:MM:SS -> HH:MM)
    return timeString.substring(0, 5);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Calendar className="h-8 w-8 text-persian_orange-600" />
          Event Attendance
        </h1>
        <p className="text-gray-600 mt-1">View event registrations and capacity utilization</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event Name</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Registrations</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Utilization</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((event) => (
              <TableRow key={event.event_id}>
                <TableCell className="font-medium">{event.event_name}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{formatDate(event.event_date)}</div>
                    <div className="text-gray-500">
                      {formatTime(event.start_time)} - {formatTime(event.end_time)}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-600">{event.location || 'N/A'}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-dark_spring_green-600" />
                    <span className="font-semibold">{event.total_registered}</span>
                    <span className="text-sm text-gray-500">({event.registration_count} bookings)</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {event.max_participants || 'Unlimited'}
                  </Badge>
                </TableCell>
                <TableCell className="font-semibold text-persian_orange-600">
                  ${parseFloat(event.total_revenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell>
                  {event.capacity_percentage !== null ? (
                    <Badge variant={getCapacityBadge(parseFloat(event.capacity_percentage))}>
                      {parseFloat(event.capacity_percentage).toFixed(1)}%
                    </Badge>
                  ) : (
                    <span className="text-sm text-gray-500">N/A</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {data.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No upcoming events found</p>
          </div>
        )}
      </div>
    </div>
  );
}
