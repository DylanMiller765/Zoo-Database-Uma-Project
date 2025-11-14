import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, Users } from "lucide-react";

interface EventRevenueData {
  total: number;
  registrations: number;
  participants: number;
  byEvent: Array<{
    event_id: number;
    event_name: string;
    event_date: string;
    location: string | null;
    ticket_price: number | null;
    registrations: number;
    participants: number;
    revenue: number;
    avg_per_registration: number;
    payment_status: string;
  }>;
}

interface Props {
  data: EventRevenueData;
}

export function EventRevenueSection({ data }: Props) {
  const formatMoney = (amount: number | string) => {
    const num = parseFloat(String(amount || 0));
    return num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadgeColor = (status: string) => {
    if (status === 'paid') return 'bg-green-100 text-green-800';
    if (status === 'pending') return 'bg-yellow-100 text-yellow-800';
    if (status === 'cancelled') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <Card className="border-l-4 border-purple-500">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-xl">Event Revenue</CardTitle>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-600">
              ${formatMoney(data.total)}
            </div>
            <div className="text-sm text-gray-600 flex items-center justify-end gap-1">
              <Users className="h-3 w-3" />
              {data.participants} participants ({data.registrations} registrations)
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Revenue by Event
          </h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Registrations</TableHead>
                  <TableHead className="text-right">Participants</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Avg/Registration</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.byEvent.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No event revenue data available for the selected period
                    </TableCell>
                  </TableRow>
                ) : (
                  data.byEvent.map((row) => (
                    <TableRow key={`${row.event_id}-${row.payment_status}`}>
                      <TableCell className="font-medium">{row.event_name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          {formatDate(row.event_date)}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {row.location || 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">{row.registrations}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Users className="h-3 w-3 text-gray-400" />
                          {row.participants}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-purple-600">
                        ${formatMoney(row.revenue)}
                      </TableCell>
                      <TableCell className="text-right">
                        ${formatMoney(row.avg_per_registration)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(row.payment_status)}>
                          {formatStatus(row.payment_status)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
