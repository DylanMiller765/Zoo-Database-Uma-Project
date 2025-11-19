"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { queryService, type EventPerformanceParams } from "@/services/query.service";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, Users, DollarSign, TrendingUp } from "lucide-react";
import {
  ReportParametersCard,
  DateRangePicker,
  ReportEmptyState,
  GenerateReportButton
} from "@/components/reports";

type EventRow = {
  event_id: number;
  event_name: string;
  event_date: string;
  start_time: string;
  end_time: string;
  location: string | null;
  max_participants: number | null;
  ticket_price: number | null;
  total_registered: number;
  total_revenue: number;
  registration_count: number;
  capacity_percentage: number | null;
  coordinator_name: string | null;
  description: string | null;
  is_past?: boolean;
};

export default function EventPerformancePage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  // Report state
  const [hasGenerated, setHasGenerated] = useState(false);
  const [data, setData] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(false);

  // Parameters
  const [params, setParams] = useState<EventPerformanceParams>({
    startDate: '',
    endDate: '',
    eventStatus: 'all',
    includeCanceled: false
  });

  // Summary metrics
  const summary = useMemo(() => {
    return {
      totalEvents: data.length,
      totalAttendees: data.reduce((sum, e) => sum + (e.registration_count || 0), 0),
      totalRevenue: data.reduce((sum, e) => sum + parseFloat(String(e.total_revenue || 0)), 0),
      avgCapacity: data.length > 0
        ? data.reduce((sum, e) => sum + parseFloat(String(e.capacity_percentage || 0)), 0) / data.filter(e => e.capacity_percentage !== null).length
        : 0
    };
  }, [data]);

  // Generate report handler
  const handleGenerate = async () => {
    try {
      setLoading(true);
      const result = await queryService.getEventPerformance(params);
      setData(result);
      setHasGenerated(true);
    } catch (error) {
      console.error("Failed to generate report:", error);
      alert("Failed to generate report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Clear handler
  const handleClear = () => {
    setParams({
      startDate: '',
      endDate: '',
      eventStatus: 'all',
      includeCanceled: false
    });
    setHasGenerated(false);
    setData([]);
  };

  // Helper functions
  const formatDate = (dateString: string) => {
    // Format YYYY-MM-DD directly without timezone conversion
    const [year, month, day] = dateString.split('-');
    return `${month}/${day}/${year}`;
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return "";
    return timeString.substring(0, 5);
  };

  const formatMoney = (amount: number | string) => {
    const num = parseFloat(String(amount || 0));
    return num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const getCapacityBadge = (percentage: number | null) => {
    if (percentage === null) return "default";
    if (percentage >= 90) return "danger";
    if (percentage >= 70) return "warning";
    if (percentage >= 50) return "secondary";
    return "success";
  };

  const getEventStatusBadge = (eventDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDateObj = new Date(eventDate);
    eventDateObj.setHours(0, 0, 0, 0);
    return eventDateObj < today ? "default" : "success";
  };

  const getEventStatusLabel = (eventDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDateObj = new Date(eventDate);
    eventDateObj.setHours(0, 0, 0, 0);
    return eventDateObj < today ? "Past" : "Upcoming";
  };

  // Auth check
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark_spring_green-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Calendar className="h-8 w-8 text-persian_orange-600" />
          Event Performance Report
        </h1>
      </div>

      {/* Parameters Form */}
      <Card>
        <CardContent className="space-y-4 pt-6">
        <DateRangePicker
          startDate={params.startDate}
          endDate={params.endDate}
          onRangeChange={(startDate, endDate) => setParams({ ...params, startDate, endDate })}
          label="Event Date Range"
          required={true}
          showQuickSelect={true}
        />

        <div>
          {/* Event Status Filter */}
          <Label htmlFor="eventStatus" className="text-sm font-medium text-gray-700">
            Event Status
          </Label>
          <select
            id="eventStatus"
            value={params.eventStatus}
            onChange={(e) => setParams({ ...params, eventStatus: e.target.value })}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="all">All Events</option>
            <option value="upcoming">Upcoming Only</option>
            <option value="past">Past Only</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="includeCanceled"
            checked={params.includeCanceled}
            onChange={(e) => setParams({ ...params, includeCanceled: e.target.checked })}
            className="rounded border-gray-300"
          />
          <Label htmlFor="includeCanceled" className="text-sm font-medium text-gray-700 mb-0 cursor-pointer">
            Show Cancelled Events
          </Label>
        </div>

        {/* Generate Button */}
        <GenerateReportButton
          onGenerate={handleGenerate}
          onClear={handleClear}
          loading={loading}
          hasGenerated={hasGenerated}
        />
        </CardContent>
      </Card>

      {/* Empty State or Results */}
      {!hasGenerated && (
        <ReportEmptyState
          icon={<Calendar className="h-16 w-16 text-persian_orange-400" />}
        />
      )}

      {hasGenerated && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Events</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-persian_orange-600">
                  {summary.totalEvents}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  Total Attendees
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-dark_spring_green-600">
                  {summary.totalAttendees.toLocaleString()}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-sea_green-600">
                  ${formatMoney(summary.totalRevenue)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Avg Capacity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-purple-600">
                  {summary.avgCapacity.toFixed(1)}%
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Events Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event Name</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead className="text-right">Ticket Price</TableHead>
                      <TableHead className="text-right">Attendees</TableHead>
                      <TableHead className="text-right">Capacity</TableHead>
                      <TableHead className="text-center">Capacity %</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((event) => (
                      <TableRow key={event.event_id}>
                        {/* Event Name */}
                        <TableCell className="font-medium">
                          <div>
                            <div>{event.event_name}</div>
                            {event.coordinator_name && (
                              <div className="text-xs text-gray-500">
                                Coordinator: {event.coordinator_name}
                              </div>
                            )}
                          </div>
                        </TableCell>

                        {/* Date & Time */}
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">{formatDate(event.event_date)}</div>
                            <div className="text-gray-500">
                              {formatTime(event.start_time)} - {formatTime(event.end_time)}
                            </div>
                          </div>
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                          <Badge variant={getEventStatusBadge(event.event_date)}>
                            {getEventStatusLabel(event.event_date)}
                          </Badge>
                        </TableCell>

                        {/* Location */}
                        <TableCell className="text-sm text-gray-600">
                          {event.location || "N/A"}
                        </TableCell>

                        {/* Ticket Price */}
                        <TableCell className="text-right font-semibold">
                          {event.ticket_price !== null ? `$${formatMoney(event.ticket_price)}` : "Free"}
                        </TableCell>

                        {/* Attendees */}
                        <TableCell className="text-right">
                          <div className="flex flex-col items-end">
                            <span className="font-semibold">{event.total_registered}</span>
                            <span className="text-xs text-gray-500">
                              ({event.registration_count} bookings)
                            </span>
                          </div>
                        </TableCell>

                        {/* Capacity */}
                        <TableCell className="text-right">
                          <Badge variant="outline">
                            {event.max_participants || "Unlimited"}
                          </Badge>
                        </TableCell>

                        {/* Capacity % */}
                        <TableCell className="text-center">
                          {event.capacity_percentage !== null ? (
                            <Badge variant={getCapacityBadge(parseFloat(String(event.capacity_percentage)))}>
                              {parseFloat(String(event.capacity_percentage)).toFixed(1)}%
                            </Badge>
                          ) : (
                            <span className="text-sm text-gray-500">N/A</span>
                          )}
                        </TableCell>

                        {/* Revenue */}
                        <TableCell className="text-right font-semibold text-persian_orange-600">
                          ${formatMoney(event.total_revenue)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* No Data State */}
              {data.length === 0 && (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    No events found matching the selected criteria.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Try adjusting your date range or filters.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
