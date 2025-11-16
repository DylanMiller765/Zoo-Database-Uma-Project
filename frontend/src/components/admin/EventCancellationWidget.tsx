/**
 * Event Cancellation Widget
 *
 * Displays recent event cancellations with statistics for the admin dashboard.
 * Shows data from the event_cancellation_logs table, which is populated by
 * the trg_event_cancellation_notification database trigger.
 *
 * This demonstrates how database triggers integrate with the application layer.
 */

"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Users, DollarSign, Clock } from 'lucide-react';
import apiClient from '@/lib/api';

interface EventCancellationLog {
  log_id: number;
  event_id: number;
  event_name: string;
  event_date: string;
  cancelled_at: string;
  cancelled_by: string;
  total_registrations: number;
  customers_notified: number;
  refunds_needed: number;
}

interface EventCancellationWidgetProps {
  limit?: number;  // Maximum number of cancellations to display (default: 5)
}

export function EventCancellationWidget({ limit = 5 }: EventCancellationWidgetProps) {
  const [logs, setLogs] = useState<EventCancellationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCancellationLogs();
  }, []);

  const loadCancellationLogs = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch recent event cancellation logs using API client (handles auth automatically)
      const response = await apiClient.get(`/event-cancellations?limit=${limit}`);
      console.log('[EventCancellationWidget] Loaded logs:', response.data);
      setLogs(response.data);
    } catch (err: any) {
      console.error('[EventCancellationWidget] Error loading event cancellation logs:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load event cancellation logs';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const cancelledDate = new Date(timestamp);
    const diffMs = now.getTime() - cancelledDate.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return diffMins <= 1 ? '1 minute ago' : `${diffMins} minutes ago`;
    } else if (diffHours < 24) {
      return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
    } else if (diffDays < 30) {
      return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
    } else {
      return formatDateTime(timestamp);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span>Recent Event Cancellations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span>Recent Event Cancellations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600">Error loading cancellation logs</p>
            <p className="text-sm text-gray-500 mt-1">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span>Recent Event Cancellations</span>
          </div>
          {logs.length > 0 && (
            <span className="text-xs text-gray-500 font-normal">
              Via Database Trigger
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-3">
              <AlertTriangle className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-gray-600 font-medium">No recent cancellations</p>
            <p className="text-sm text-gray-500 mt-1">All events are running as scheduled</p>
          </div>
        ) : (
          <div className="space-y-4">
            {logs.map((log) => (
              <div
                key={log.log_id}
                className="border-2 border-red-200 rounded-lg p-4 hover:border-red-300 transition-colors bg-red-50"
              >
                {/* Event Name and Date */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-base">
                      {log.event_name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Was scheduled for: {formatDate(log.event_date)}
                    </p>
                  </div>
                  <div className="px-2 py-1 rounded bg-red-600 text-white text-xs font-medium">
                    CANCELLED
                  </div>
                </div>

                {/* Statistics Grid */}
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div className="bg-white rounded-lg p-2 border border-gray-200">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-600" />
                      <div>
                        <p className="text-xs text-gray-500">Notified</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {log.customers_notified}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-2 border border-gray-200">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-gray-600" />
                      <div>
                        <p className="text-xs text-gray-500">Refunds</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {log.refunds_needed}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-2 border border-gray-200">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-600" />
                      <div>
                        <p className="text-xs text-gray-500">Total</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {log.total_registrations}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Metadata */}
                <div className="flex items-center justify-between text-xs text-gray-600 pt-2 border-t border-gray-200">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{getTimeAgo(log.cancelled_at)}</span>
                  </div>
                  <span className="text-gray-500">
                    By: {log.cancelled_by}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Info */}
        {logs.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-start space-x-2 text-xs text-gray-600">
              <AlertTriangle className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <p>
                <strong>Note:</strong> These notifications are automatically generated by a database trigger (
                <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">trg_event_cancellation_notification</code>
                ) when an event is cancelled. Customers receive in-app notifications instantly.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
