"use client";

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { eventService } from '@/services/event.service';
import { Event } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Search, Edit, Trash2, Calendar, Info } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { EventForm } from '@/components/admin/EventForm';
import { EntityDetailModal } from '@/components/ui/EntityDetailModal';
import { ShowDeletedToggle } from '@/components/admin/ShowDeletedToggle';

export default function EventsPage() {
  const { isAuthenticated, loading: authLoading, hasRole } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [showDeleted, setShowDeleted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailEvent, setDetailEvent] = useState<Event | null>(null);
  const isManager = hasRole('manager');

  const hasOpenedModal = useRef(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (hasOpenedModal.current) return;
    if (searchParams.get('autoOpen') === 'true') {
      handleAdd();
      hasOpenedModal.current = true;
    }
  }, [searchParams]);

  useEffect(() => {
    if (isAuthenticated) {
      loadEvents();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      loadEvents();
    }
  }, [showDeleted]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await eventService.getAll(showDeleted);
      setEvents(data);
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleEdit = (event: Event, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleRowClick = (event: Event) => {
    setDetailEvent(event);
    setIsDetailModalOpen(true);
  };

  const handleDeleteClick = (event: Event, e: React.MouseEvent) => {
    e.stopPropagation();
    setEventToDelete(event);
    setIsDeleteModalOpen(true);
  };

  const isDeleted = (event: Event) => event.deleted_at !== null && event.deleted_at !== undefined;

  const handleDelete = async () => {
    if (!eventToDelete?.event_id) return;

    try {
      await eventService.delete(eventToDelete.event_id);
      await loadEvents();
      setIsDeleteModalOpen(false);
      setEventToDelete(null);
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  const handleFormSuccess = async () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    await loadEvents();
  };

  const filteredEvents = events
    .filter(event => event) // Add this line to filter out null or undefined events
    .filter(event => {
      // Search filter
      const matchesSearch = event.event_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus = statusFilter === 'all' || (event.status || 'scheduled') === statusFilter;

      // Date filter
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const eventDate = new Date(event.event_date);
      eventDate.setHours(0, 0, 0, 0);

      const matchesDate = dateFilter === 'all' ||
        (dateFilter === 'upcoming' && eventDate >= today) ||
        (dateFilter === 'past' && eventDate < today);

      return matchesSearch && matchesStatus && matchesDate;
    })
    .sort((a, b) => {
      // Sorting
      if (sortBy === 'date') {
        const dateA = new Date(a.event_date).getTime();
        const dateB = new Date(b.event_date).getTime();
        return dateA - dateB; // Soonest first
      } else if (sortBy === 'name') {
        return a.event_name.localeCompare(b.event_name);
      } else if (sortBy === 'capacity') {
        const registrationsA = a.current_registrations || 0;
        const registrationsB = b.current_registrations || 0;
        return registrationsB - registrationsA; // Most registered first
      }
      return 0;
    });

  const getStatusBadge = (status?: string): "default" | "secondary" | "success" | "warning" | "danger" => {
    if (!status) return 'default';
    const variants: Record<string, typeof status> = {
      scheduled: 'secondary',
      ongoing: 'success',
      completed: 'default',
      cancelled: 'danger',
    };
    return variants[status] as any || 'default';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark_spring_green-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="h-8 w-8 text-persian_orange-600" />
            Events Management
          </h1>
          <p className="text-gray-600 mt-1">Manage zoo events and schedules</p>
        </div>
        <Button onClick={handleAdd} variant="accent" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Event
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {isManager && (
          <ShowDeletedToggle
            checked={showDeleted}
            onChange={setShowDeleted}
          />
        )}

        <div className="w-auto">
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </Select>
        </div>

        <div className="w-auto">
          <Select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
            <option value="all">All Dates</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </Select>
        </div>

        <div className="w-auto">
          <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="capacity">Sort by Registrations</option>
          </Select>
        </div>

        <Badge variant="outline" className="text-sm">
          {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEvents.map((event) => (
              <TableRow
                key={event.event_id}
                onClick={() => handleRowClick(event)}
                className={`cursor-pointer hover:bg-gray-50 ${isDeleted(event) ? 'opacity-60 bg-red-50' : ''}`}
              >
                <TableCell className="font-medium">{event.event_name}</TableCell>
                <TableCell>{formatDate(event.event_date)}</TableCell>
                <TableCell>
                  {event.start_time} - {event.end_time}
                </TableCell>
                <TableCell>{event.location || 'N/A'}</TableCell>
                <TableCell>
                  {event.max_capacity || 'Unlimited'}
                </TableCell>
                <TableCell>
                  {isDeleted(event) ? (
                    <Badge variant="danger">Deleted</Badge>
                  ) : (
                    <Badge variant={getStatusBadge(event.status || 'scheduled')} className="capitalize">
                      {event.status || 'scheduled'}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {!isDeleted(event) ? (
                      <>
                        <Button variant="ghost" size="sm" onClick={(e) => handleEdit(event, e)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleDeleteClick(event, e)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <span className="text-sm text-gray-500 italic">Cancelled</span>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No events found</p>
          </div>
        )}
      </div>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedEvent ? 'Edit Event' : 'Add New Event'}
        description={selectedEvent ? `Update information for ${selectedEvent.event_name}` : 'Create a new zoo event'}
        size="xl"
      >
        <EventForm event={selectedEvent} onSuccess={handleFormSuccess} onCancel={() => setIsModalOpen(false)} />
      </Modal>

      <Modal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Cancel Event"
        description="Deleting an event will cancel it and automatically notify all registered customers."
      >
        <div className="space-y-4">
          {eventToDelete && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-gray-900">
                <span className="font-semibold">{eventToDelete.event_name}</span> on {eventToDelete.event_date}
              </p>
            </div>
          )}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-gray-900">
              <span className="font-semibold">⚠️ This will:</span>
            </p>
            <ul className="text-sm text-gray-700 mt-2 ml-4 list-disc space-y-1">
              <li>Send cancellation notifications to all registered customers</li>
              <li>Mark the event as cancelled in the system</li>
              <li>Process refunds for paid registrations (within 5-7 business days)</li>
            </ul>
          </div>
          <div className="flex items-center gap-3 justify-end">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Keep Event
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Cancel Event
            </Button>
          </div>
        </div>
      </Modal>

      {/* Info banner for deleted events */}
      {showDeleted && filteredEvents.some(e => isDeleted(e)) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-900">
            <p className="font-semibold">Cancelled events cannot be restored</p>
            <p className="text-blue-800 mt-1">
              Once an event is cancelled, refunds are automatically processed for all registered customers.
              To reschedule a cancelled event, please create a new event instead.
            </p>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <EntityDetailModal
        open={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Event Details"
        entity={detailEvent}
        sections={[
          {
            title: 'Basic Information',
            fields: [
              { label: 'Event Name', key: 'event_name' },
              { label: 'Description', key: 'description' },
              { label: 'Location', key: 'location' },
              { label: 'Status', key: 'status', type: 'enum' as const },
            ],
          },
          {
            title: 'Schedule',
            fields: [
              { label: 'Event Date', key: 'event_date', type: 'date' as const },
              { label: 'Start Time', key: 'start_time' },
              { label: 'End Time', key: 'end_time' },
            ],
          },
          {
            title: 'Capacity & Pricing',
            fields: [
              { label: 'Max Participants', key: 'max_capacity', type: 'number' as const },
              { label: 'Current Registrations', key: 'current_registrations', type: 'number' as const },
              { label: 'Ticket Price', key: 'ticket_price', type: 'currency' as const },
            ],
          },
          {
            title: 'Coordinator',
            fields: [
              { label: 'Coordinator', key: 'coordinator_name' },
            ],
          },
        ]}
        onEdit={detailEvent && !isDeleted(detailEvent) ? () => {
          setIsDetailModalOpen(false);
          setSelectedEvent(detailEvent);
          setIsModalOpen(true);
        } : undefined}
        canEdit={detailEvent ? !isDeleted(detailEvent) : false}
      />
    </div>
  );
}
