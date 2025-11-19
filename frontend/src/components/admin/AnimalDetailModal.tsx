"use client";

import { useState, useEffect } from 'react';
import { Animal, FeedingSchedule, FeedingLogWithKeeper } from '@/types';
import { feedingScheduleService } from '@/services/feedingSchedule.service';
import { feedingLogService } from '@/services/feedingLog.service';
import { animalService } from '@/services/animal.service';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FeedingScheduleForm } from './FeedingScheduleForm';
import { FeedingLogForm } from './FeedingLogForm';
import { Edit, Plus, Trash2, Calendar, ClipboardList } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface AnimalDetailModalProps {
  open: boolean;
  onClose: () => void;
  animal: Animal | null;
  onEdit?: () => void;
  canEdit?: boolean;
}

type TabType = 'info' | 'schedules' | 'logs' | 'medical';

export function AnimalDetailModal({ open, onClose, animal, onEdit, canEdit = true }: AnimalDetailModalProps) {
  const { hasRole } = useAuth();

  // Set default tab based on role
  const getDefaultTab = (): TabType => {
    if (hasRole('keeper')) return 'schedules';
    if (hasRole('veterinarian')) return 'medical';
    return 'info';
  };

  const [activeTab, setActiveTab] = useState<TabType>(getDefaultTab());
  const [schedules, setSchedules] = useState<FeedingSchedule[]>([]);
  const [logs, setLogs] = useState<FeedingLogWithKeeper[]>([]);
  const [loadingSchedules, setLoadingSchedules] = useState(false);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Form states
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [showLogForm, setShowLogForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<FeedingSchedule | null>(null);
  const [editingLog, setEditingLog] = useState<FeedingLogWithKeeper | null>(null);

  // Delete modal states
  const [isDeleteScheduleModalOpen, setIsDeleteScheduleModalOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState<FeedingSchedule | null>(null);
  const [isDeleteLogModalOpen, setIsDeleteLogModalOpen] = useState(false);
  const [logToDelete, setLogToDelete] = useState<FeedingLogWithKeeper | null>(null);

  // Medical tab states
  const [editingMedical, setEditingMedical] = useState(false);
  const [medicalForm, setMedicalForm] = useState({
    health_status: animal?.health_status || 'good',
    medical_notes: animal?.medical_notes || ''
  });

  const canManageFeeding = hasRole('keeper') || hasRole('veterinarian') || hasRole('manager');
  const canViewLogs = hasRole('keeper') || hasRole('veterinarian') || hasRole('manager');
  const canDeleteSchedule = hasRole('veterinarian') || hasRole('manager');
  const canDeleteLog = hasRole('keeper') || hasRole('manager');

  // Reset tab to default when modal opens
  useEffect(() => {
    if (open) {
      setActiveTab(getDefaultTab());
    }
  }, [open]);

  useEffect(() => {
    if (open && animal) {
      loadSchedules();
      if (canViewLogs) {
        loadLogs();
      }
    }
  }, [open, animal, canViewLogs]);

  const loadSchedules = async () => {
    if (!animal) return;
    setLoadingSchedules(true);
    try {
      const data = await feedingScheduleService.getByAnimalId(animal.animal_id);
      setSchedules(data);
    } catch (error) {
      console.error('Failed to load feeding schedules:', error);
    } finally {
      setLoadingSchedules(false);
    }
  };

  const loadLogs = async () => {
    if (!animal) return;
    setLoadingLogs(true);
    try {
      const data = await feedingLogService.getByAnimalId(animal.animal_id, 20); // Last 20 logs
      setLogs(data);
    } catch (error) {
      console.error('Failed to load feeding logs:', error);
    } finally {
      setLoadingLogs(false);
    }
  };

  const handleDeleteScheduleClick = (schedule: FeedingSchedule) => {
    setScheduleToDelete(schedule);
    setIsDeleteScheduleModalOpen(true);
  };

  const handleDeleteSchedule = async () => {
    if (!scheduleToDelete) return;
    try {
      await feedingScheduleService.delete(scheduleToDelete.schedule_id);
      await loadSchedules();
      setIsDeleteScheduleModalOpen(false);
      setScheduleToDelete(null);
    } catch (error) {
      console.error('Failed to delete schedule:', error);
    }
  };

  const handleDeleteLogClick = (log: FeedingLogWithKeeper) => {
    setLogToDelete(log);
    setIsDeleteLogModalOpen(true);
  };

  const handleDeleteLog = async () => {
    if (!logToDelete) return;
    try {
      await feedingLogService.delete(logToDelete.log_id);
      await loadLogs();
      setIsDeleteLogModalOpen(false);
      setLogToDelete(null);
    } catch (error) {
      console.error('Failed to delete log:', error);
    }
  };

  const handleScheduleSuccess = async () => {
    setShowScheduleForm(false);
    setEditingSchedule(null);
    await loadSchedules();
  };

  const handleLogSuccess = async () => {
    setShowLogForm(false);
    setEditingLog(null);
    await loadLogs();
    await loadSchedules(); // Refresh schedules too
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!animal) return null;

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        title={`Animal: ${animal.name}`}
        size="xl"
      >
      <div className="space-y-4">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex gap-6">
            <button
              onClick={() => setActiveTab('info')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'info'
                  ? 'border-sea_green-600 text-sea_green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Basic Information
            </button>
            {(hasRole('veterinarian') || hasRole('manager')) && (
              <button
                onClick={() => setActiveTab('medical')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'medical'
                    ? 'border-sea_green-600 text-sea_green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Medical Overview
              </button>
            )}
            <button
              onClick={() => setActiveTab('schedules')}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === 'schedules'
                  ? 'border-sea_green-600 text-sea_green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Calendar className="h-4 w-4" />
              Feeding Schedules ({schedules.length})
            </button>
            {canViewLogs && (
              <button
                onClick={() => setActiveTab('logs')}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === 'logs'
                    ? 'border-sea_green-600 text-sea_green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <ClipboardList className="h-4 w-4" />
                Feeding Logs ({logs.length})
              </button>
            )}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="max-h-[60vh] overflow-y-auto">
          {activeTab === 'info' && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{animal.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Scientific Name</p>
                    <p className="font-medium italic">{animal.scientific_name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Species</p>
                    <p className="font-medium">{animal.species}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="font-medium capitalize">{animal.gender || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date of Birth</p>
                    <p className="font-medium">{formatDate(animal.date_of_birth)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Arrival Date</p>
                    <p className="font-medium">{formatDate(animal.arrival_date)}</p>
                  </div>
                </div>
              </div>

              {/* Health & Status */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Health & Status</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Health Status</p>
                    <Badge variant={animal.health_status === 'excellent' || animal.health_status === 'good' ? 'success' : 'warning'} className="capitalize">
                      {animal.health_status || 'Good'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Active Status</p>
                    <Badge variant={animal.active_status === 'active' ? 'success' : 'secondary'} className="capitalize">
                      {animal.active_status || 'Active'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Endangerment Status</p>
                    <p className="font-medium capitalize">{animal.endangerment_status?.replace('_', ' ') || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Weight (kg)</p>
                    <p className="font-medium">{animal.weight || 'N/A'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Medical Notes</p>
                    <p className="font-medium">{animal.medical_notes || 'None'}</p>
                  </div>
                </div>
              </div>

              {/* Location & Origin */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Location & Origin</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Place of Origin</p>
                    <p className="font-medium">{animal.place_of_origin || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Habitat</p>
                    <p className="font-medium">{animal.habitat_name || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schedules' && (
            <div className="space-y-4">
              {canManageFeeding && !showScheduleForm && (
                <div className="flex justify-end">
                  <Button onClick={() => setShowScheduleForm(true)} size="sm" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Schedule
                  </Button>
                </div>
              )}

              {showScheduleForm && (
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h4 className="font-semibold mb-4">
                    {editingSchedule ? 'Edit Feeding Schedule' : 'Add Feeding Schedule'}
                  </h4>
                  <FeedingScheduleForm
                    animalId={animal.animal_id}
                    schedule={editingSchedule}
                    onSuccess={handleScheduleSuccess}
                    onCancel={() => {
                      setShowScheduleForm(false);
                      setEditingSchedule(null);
                    }}
                  />
                </div>
              )}

              {loadingSchedules ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sea_green-600 mx-auto"></div>
                </div>
              ) : schedules.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p>No feeding schedules defined</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {schedules.map((schedule) => (
                    <div key={schedule.schedule_id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{schedule.food_description}</h4>
                          <div className="mt-2 space-y-1 text-sm">
                            {schedule.frequency && (
                              <p className="text-gray-600">
                                <span className="font-medium">Frequency:</span> {schedule.frequency}
                              </p>
                            )}
                            {schedule.scheduled_time && (
                              <p className="text-gray-600">
                                <span className="font-medium">Time:</span> {schedule.scheduled_time}
                              </p>
                            )}
                            {schedule.notes && (
                              <p className="text-gray-600">
                                <span className="font-medium">Notes:</span> {schedule.notes}
                              </p>
                            )}
                          </div>
                        </div>
                        {canManageFeeding && (
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingSchedule(schedule);
                                setShowScheduleForm(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            {canDeleteSchedule && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteScheduleClick(schedule)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'logs' && canViewLogs && (
            <div className="space-y-4">
              {canManageFeeding && !showLogForm && (
                <div className="flex justify-end">
                  <Button onClick={() => setShowLogForm(true)} size="sm" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Log Feeding
                  </Button>
                </div>
              )}

              {showLogForm && (
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h4 className="font-semibold mb-4">
                    {editingLog ? 'Edit Feeding Log' : 'Log Feeding Event'}
                  </h4>
                  <FeedingLogForm
                    animalId={animal.animal_id}
                    log={editingLog}
                    schedules={schedules}
                    onSuccess={handleLogSuccess}
                    onCancel={() => {
                      setShowLogForm(false);
                      setEditingLog(null);
                    }}
                  />
                </div>
              )}

              {loadingLogs ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sea_green-600 mx-auto"></div>
                </div>
              ) : logs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ClipboardList className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p>No feeding logs recorded</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {logs.map((log) => (
                    <div key={log.log_id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="text-sm text-gray-500">{formatDateTime(log.feeding_time)}</p>
                            {log.keeper_name && (
                              <Badge variant="outline" className="text-xs">
                                {log.keeper_name}
                              </Badge>
                            )}
                          </div>
                          <h4 className="font-semibold text-gray-900">{log.food_given}</h4>
                          <div className="mt-1 space-y-1 text-sm">
                            {log.quantity_given && (
                              <p className="text-gray-600">
                                <span className="font-medium">Quantity:</span> {log.quantity_given}
                              </p>
                            )}
                            {log.notes && (
                              <p className="text-gray-600">
                                <span className="font-medium">Notes:</span> {log.notes}
                              </p>
                            )}
                          </div>
                        </div>
                        {canManageFeeding && (
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingLog(log);
                                setShowLogForm(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            {canDeleteLog && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteLogClick(log)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'medical' && (hasRole('veterinarian') || hasRole('manager')) && (
            <div className="space-y-6">
              {/* Medical Status Card */}
              <div className="border border-gray-200 rounded-lg p-6 bg-gradient-to-br from-white to-gray-50">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Medical Information</h3>
                  {!editingMedical && (
                    <Button
                      onClick={() => {
                        setEditingMedical(true);
                        setMedicalForm({
                          health_status: animal.health_status || 'good',
                          medical_notes: animal.medical_notes || ''
                        });
                      }}
                      size="sm"
                      variant="outline"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Update Medical Info
                    </Button>
                  )}
                </div>

                {editingMedical ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Health Status
                      </label>
                      <select
                        value={medicalForm.health_status}
                        onChange={(e) => setMedicalForm({ ...medicalForm, health_status: e.target.value as 'excellent' | 'good' | 'fair' | 'poor' | 'critical' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sea_green-600 focus:border-transparent"
                      >
                        <option value="excellent">Excellent</option>
                        <option value="good">Good</option>
                        <option value="fair">Fair</option>
                        <option value="poor">Poor</option>
                        <option value="critical">Critical</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Medical Notes
                      </label>
                      <textarea
                        value={medicalForm.medical_notes}
                        onChange={(e) => setMedicalForm({ ...medicalForm, medical_notes: e.target.value })}
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sea_green-600 focus:border-transparent"
                        placeholder="Enter medical observations, diagnoses, treatments, or concerns..."
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditingMedical(false);
                          setMedicalForm({
                            health_status: animal.health_status || 'good',
                            medical_notes: animal.medical_notes || ''
                          });
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={async () => {
                          try {
                            await animalService.update(animal.animal_id, medicalForm);
                            setEditingMedical(false);
                            // Update local animal object
                            animal.health_status = medicalForm.health_status as any;
                            animal.medical_notes = medicalForm.medical_notes;
                            // Force reload by closing and reopening would be better, but this works
                            onClose();
                          } catch (error) {
                            console.error('Failed to update medical info:', error);
                            alert('Failed to update medical information. Please try again.');
                          }
                        }}
                      >
                        Save Changes
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Health Status</p>
                        <Badge
                          variant={
                            animal.health_status === 'excellent' || animal.health_status === 'good'
                              ? 'success'
                              : animal.health_status === 'fair'
                              ? 'warning'
                              : 'danger'
                          }
                          className="capitalize text-base"
                        >
                          {animal.health_status || 'Good'}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Last Updated</p>
                        <p className="font-medium">
                          {animal.updated_date
                            ? new Date(animal.updated_date).toLocaleString()
                            : 'N/A'}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-2">Medical Notes</p>
                      <div className="bg-white border border-gray-200 rounded-lg p-4 min-h-[120px]">
                        <p className="text-gray-900 whitespace-pre-wrap">
                          {animal.medical_notes || 'No medical notes recorded.'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="border border-gray-200 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500 mb-1">Weight</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {animal.weight ? `${animal.weight} kg` : 'N/A'}
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500 mb-1">Age (Approx)</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {animal.date_of_birth
                      ? `${Math.floor(
                          (Date.now() - new Date(animal.date_of_birth).getTime()) /
                            (365.25 * 24 * 60 * 60 * 1000)
                        )} years`
                      : 'Unknown'}
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  <Badge
                    variant={animal.active_status === 'active' ? 'success' : 'secondary'}
                    className="capitalize text-base"
                  >
                    {animal.active_status || 'Active'}
                  </Badge>
                </div>
              </div>

              {/* Recent Feeding Summary */}
              <div className="border border-gray-200 rounded-lg p-4 bg-blue-50">
                <h4 className="font-semibold text-gray-900 mb-2">Nutrition Summary</h4>
                <p className="text-sm text-gray-600">
                  {schedules.length > 0
                    ? `${schedules.length} active feeding schedule${schedules.length !== 1 ? 's' : ''}`
                    : 'No feeding schedules defined'}
                  {logs.length > 0 && ` • ${logs.length} feeding log${logs.length !== 1 ? 's' : ''} recorded`}
                </p>
                {logs.length > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    Last fed: {new Date(logs[0].feeding_time).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          {canEdit && onEdit && activeTab === 'info' && (
            <Button onClick={onEdit} className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit Animal
            </Button>
          )}
        </div>
      </div>
    </Modal>

    {/* Delete Schedule Confirmation Modal */}
    <Modal
      open={isDeleteScheduleModalOpen}
      onClose={() => setIsDeleteScheduleModalOpen(false)}
      title="Delete Feeding Schedule"
      description="Are you sure you want to delete this feeding schedule?"
    >
      <div className="space-y-4">
        {scheduleToDelete && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-gray-900">
              <span className="font-semibold">{scheduleToDelete.food_description}</span>
              {scheduleToDelete.scheduled_time && ` at ${scheduleToDelete.scheduled_time}`}
            </p>
          </div>
        )}
        <div className="flex items-center gap-3 justify-end">
          <Button variant="outline" onClick={() => setIsDeleteScheduleModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDeleteSchedule}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>

    {/* Delete Log Confirmation Modal */}
    <Modal
      open={isDeleteLogModalOpen}
      onClose={() => setIsDeleteLogModalOpen(false)}
      title="Delete Feeding Log"
      description="Are you sure you want to delete this feeding log entry?"
    >
      <div className="space-y-4">
        {logToDelete && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-gray-900">
              <span className="font-semibold">{logToDelete.food_given}</span> - {new Date(logToDelete.feeding_time).toLocaleString()}
            </p>
            {logToDelete.keeper_name && (
              <p className="text-sm text-gray-600 mt-1">
                Fed by: {logToDelete.keeper_name}
              </p>
            )}
          </div>
        )}
        <div className="flex items-center gap-3 justify-end">
          <Button variant="outline" onClick={() => setIsDeleteLogModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDeleteLog}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  </>
  );
}
