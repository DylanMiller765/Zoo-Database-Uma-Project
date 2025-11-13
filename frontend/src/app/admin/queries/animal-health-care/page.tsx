"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { queryService, type AnimalHealthCareParams } from "@/services/query.service";
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
import { MapPin, Leaf, Heart, Calendar, User, FileDown, AlertTriangle } from "lucide-react";
import {
  ReportParametersCard,
  DateRangePicker,
  ReportEmptyState,
  GenerateReportButton
} from "@/components/reports";

type AnimalRow = {
  habitat_id: number;
  habitat_name: string;
  environment_type: string | null;
  animal_capacity: number;
  habitat_status: string;
  size: string | null;
  last_maintenance: string | null;
  animal_id: number | null;
  animal_name: string | null;
  species: string | null;
  date_of_birth: string | null;
  arrival_date: string | null;
  health_status: string | null;
  active_status: string | null;
  endangerment_status: string | null;
  weight: number | null;
  medical_notes: string | null;
  keeper_id: number | null;
  keeper_name: string | null;
  keeper_shift: string | null;
  scheduled_food: string | null;
  feeding_frequency: string | null;
  scheduled_time: string | null;
  feeding_logs_count: number;
  last_fed_time: string | null;
  last_food_given: string | null;
};

type HabitatGroup = {
  habitat_id: number;
  habitat_name: string;
  environment_type: string | null;
  animal_capacity: number;
  habitat_status: string;
  size: string | null;
  last_maintenance: string | null;
  animals: AnimalRow[];
};

export default function AnimalHealthCarePage() {
  const { isAuthenticated, hasRole, loading: authLoading } = useAuth();
  const router = useRouter();

  // Report state
  const [hasGenerated, setHasGenerated] = useState(false);
  const [data, setData] = useState<AnimalRow[]>([]);
  const [loading, setLoading] = useState(false);

  // View options
  const [groupBy, setGroupBy] = useState<'habitat' | 'keeper' | 'none'>('habitat');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [sortBy, setSortBy] = useState<string>('name');

  // Parameters - all filters enabled by default
  const [params, setParams] = useState<AnimalHealthCareParams>({
    startDate: '',
    endDate: '',
    habitatStatus: ['active', 'maintenance', 'renovation', 'closed'],
    healthStatus: ['excellent', 'good', 'fair', 'poor', 'critical'],
    endangerment: ['least_concern', 'near_threatened', 'vulnerable', 'endangered', 'critically_endangered', 'extinct_in_the_wild'],
    includeDeleted: false
  });

  // Group data by habitat
  const habitats: HabitatGroup[] = useMemo(() => {
    const groups = data.reduce<Record<number, HabitatGroup>>((acc, row) => {
      if (!acc[row.habitat_id]) {
        acc[row.habitat_id] = {
          habitat_id: row.habitat_id,
          habitat_name: row.habitat_name,
          environment_type: row.environment_type,
          animal_capacity: row.animal_capacity,
          habitat_status: row.habitat_status,
          size: row.size,
          last_maintenance: row.last_maintenance,
          animals: []
        };
      }
      if (row.animal_id) {
        acc[row.habitat_id].animals.push(row);
      }
      return acc;
    }, {});
    return Object.values(groups);
  }, [data]);

  // Get flat list of all animals (for ungrouped view)
  const allAnimals: AnimalRow[] = useMemo(() => {
    return data.filter(row => row.animal_id !== null);
  }, [data]);

  // Group data by keeper
  type KeeperGroup = {
    keeper_id: number | null;
    keeper_name: string | null;
    animals: AnimalRow[];
  };

  const keepers: KeeperGroup[] = useMemo(() => {
    const groups = data.reduce<Record<string, KeeperGroup>>((acc, row) => {
      if (!row.animal_id) return acc; // Skip rows without animals

      const keeperKey = row.keeper_id ? `keeper_${row.keeper_id}` : 'unassigned';

      if (!acc[keeperKey]) {
        acc[keeperKey] = {
          keeper_id: row.keeper_id,
          keeper_name: row.keeper_name,
          animals: []
        };
      }

      acc[keeperKey].animals.push(row);
      return acc;
    }, {});

    // Sort: assigned keepers first (alphabetically), then unassigned
    const groupArray = Object.values(groups);
    const assigned = groupArray.filter(g => g.keeper_id !== null).sort((a, b) =>
      (a.keeper_name || '').localeCompare(b.keeper_name || '')
    );
    const unassigned = groupArray.filter(g => g.keeper_id === null);

    return [...assigned, ...unassigned];
  }, [data]);

  // Sorting function for animals
  const sortedAnimals = useMemo(() => {
    const animals = [...allAnimals];

    switch (sortBy) {
      case 'name':
        return animals.sort((a, b) => (a.animal_name || '').localeCompare(b.animal_name || ''));
      case 'species':
        return animals.sort((a, b) => (a.species || '').localeCompare(b.species || ''));
      case 'health':
        const healthOrder = { 'critical': 0, 'poor': 1, 'fair': 2, 'good': 3, 'excellent': 4 };
        return animals.sort((a, b) =>
          (healthOrder[a.health_status as keyof typeof healthOrder] || 5) -
          (healthOrder[b.health_status as keyof typeof healthOrder] || 5)
        );
      case 'arrival_date':
        return animals.sort((a, b) => {
          if (!a.arrival_date) return 1;
          if (!b.arrival_date) return -1;
          return new Date(b.arrival_date).getTime() - new Date(a.arrival_date).getTime();
        });
      case 'last_fed':
        return animals.sort((a, b) => {
          if (!a.last_fed_time) return 1;
          if (!b.last_fed_time) return -1;
          return new Date(a.last_fed_time).getTime() - new Date(b.last_fed_time).getTime();
        });
      default:
        return animals;
    }
  }, [allAnimals, sortBy]);

  // Generate report handler
  const handleGenerate = async () => {
    try {
      setLoading(true);
      const result = await queryService.getAnimalHealthAndCare(params);
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
      habitatStatus: ['active', 'maintenance', 'renovation', 'closed'],
      healthStatus: ['excellent', 'good', 'fair', 'poor', 'critical'],
      endangerment: ['least_concern', 'near_threatened', 'vulnerable', 'endangered', 'critically_endangered', 'extinct_in_the_wild'],
      includeDeleted: false
    });
    setHasGenerated(false);
    setData([]);
  };

  // Toggle helper for multi-select
  const toggleArrayParam = (param: 'habitatStatus' | 'healthStatus' | 'endangerment', value: string) => {
    const currentArray = (params[param] || []) as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(v => v !== value)
      : [...currentArray, value];
    setParams({ ...params, [param]: newArray });
  };

  // Helper functions
  const getHealthBadge = (status: string | null) => {
    const variants: Record<string, any> = {
      excellent: "success",
      good: "secondary",
      fair: "warning",
      poor: "danger",
      critical: "danger",
    };
    return variants[status || ""] || "default";
  };

  const formatEndangerment = (status: string | null) => {
    if (!status) return "N/A";
    return status.replace(/_/g, " ");
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return "N/A";
    return timeString.substring(0, 5);
  };

  // Export functionality (placeholder for now - we'll add xlsx later)
  const handleExport = () => {
    alert("Export functionality will be implemented after xlsx dependency is resolved");
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

  // Role-based access control - only managers, veterinarians, keepers, and coordinators
  if (!hasRole('manager') && !hasRole('veterinarian') && !hasRole('keeper') && !hasRole('coordinator')) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <AlertTriangle className="h-16 w-16 text-persian_orange-600" />
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Access Restricted</h2>
          <p className="text-gray-600 mt-2">
            This report is only available to Managers, Veterinarians, Keepers, and Coordinators.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Heart className="h-8 w-8 text-sea_green-600" />
          Animal Health & Care Report
        </h1>
        <p className="text-gray-600 mt-1">
          Comprehensive animal welfare data including health status, feeding compliance, and habitat information
        </p>
      </div>

      {/* Parameters Form */}
      <ReportParametersCard title="">
        <DateRangePicker
          startDate={params.startDate || ''}
          endDate={params.endDate || ''}
          onRangeChange={(startDate, endDate) => setParams({ ...params, startDate, endDate })}
          label="Animal Arrival Date Range (Optional)"
          required={false}
          showQuickSelect={true}
        />

        {/* Habitat Status Filter */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
            Habitat Status {(params.habitatStatus || []).length > 0 && `(${(params.habitatStatus || []).length} selected)`}
          </Label>
          <div className="flex flex-wrap gap-1.5">
            {['active', 'maintenance', 'renovation', 'closed'].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => toggleArrayParam('habitatStatus', status)}
                className={`px-2.5 py-1 text-sm rounded-md border transition-colors capitalize ${
                  (params.habitatStatus || []).includes(status)
                    ? 'bg-sea_green-600 text-white border-sea_green-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-sea_green-400'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Health Status Filter */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
            Health Status {(params.healthStatus || []).length > 0 && `(${(params.healthStatus || []).length} selected)`}
          </Label>
          <div className="flex flex-wrap gap-1.5">
            {['excellent', 'good', 'fair', 'poor', 'critical'].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => toggleArrayParam('healthStatus', status)}
                className={`px-2.5 py-1 text-sm rounded-md border transition-colors capitalize ${
                  (params.healthStatus || []).includes(status)
                    ? 'bg-sea_green-600 text-white border-sea_green-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-sea_green-400'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Endangerment Filter */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
            Conservation Status {(params.endangerment || []).length > 0 && `(${(params.endangerment || []).length} selected)`}
          </Label>
          <div className="flex flex-wrap gap-1.5">
            {[
              { value: 'least_concern', label: 'Least Concern' },
              { value: 'near_threatened', label: 'Near Threatened' },
              { value: 'vulnerable', label: 'Vulnerable' },
              { value: 'endangered', label: 'Endangered' },
              { value: 'critically_endangered', label: 'Critically Endangered' },
              { value: 'extinct_in_the_wild', label: 'Extinct in Wild' }
            ].map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => toggleArrayParam('endangerment', value)}
                className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
                  (params.endangerment || []).includes(value)
                    ? 'bg-sea_green-600 text-white border-sea_green-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-sea_green-400'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Include Deleted Checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="includeDeleted"
            checked={params.includeDeleted}
            onChange={(e) => setParams({ ...params, includeDeleted: e.target.checked })}
            className="rounded border-gray-300 text-sea_green-600 focus:ring-sea_green-500"
          />
          <Label htmlFor="includeDeleted" className="text-sm text-gray-700 cursor-pointer">
            Include deleted animals and habitats
          </Label>
        </div>

        {/* Generate Button */}
        <GenerateReportButton
          onGenerate={handleGenerate}
          onClear={handleClear}
          loading={loading}
          hasGenerated={hasGenerated}
        />
      </ReportParametersCard>

      {/* Empty State or Results */}
      {!hasGenerated && (
        <ReportEmptyState
          icon={<Heart className="h-16 w-16 text-sea_green-400" />}
          title="No Report Generated"
          description="Configure the parameters above and click Generate Report to view animal health and care data."
        />
      )}

      {hasGenerated && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Animals</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-sea_green-600">
                  {habitats.reduce((sum, h) => sum + h.animals.length, 0)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Habitats</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-dark_spring_green-600">
                  {habitats.length}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Health Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-persian_orange-600">
                  {habitats.reduce((sum, h) =>
                    sum + h.animals.filter(a =>
                      ['fair', 'poor', 'critical'].includes(a.health_status || '')
                    ).length, 0
                  )}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Endangered Species</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-red-600">
                  {habitats.reduce((sum, h) =>
                    sum + h.animals.filter(a =>
                      ['endangered', 'critically_endangered', 'extinct_in_the_wild'].includes(a.endangerment_status || '')
                    ).length, 0
                  )}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* View Controls and Export Button */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* View Options */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Group By Selector */}
              <div>
                <Label className="text-xs text-gray-600 mb-1 block">Group By</Label>
                <select
                  value={groupBy}
                  onChange={(e) => setGroupBy(e.target.value as 'habitat' | 'keeper' | 'none')}
                  className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
                >
                  <option value="habitat">Habitat</option>
                  <option value="keeper">Keeper</option>
                  <option value="none">No Grouping</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div>
                <Label className="text-xs text-gray-600 mb-1 block">Display</Label>
                <div className="flex items-center gap-1 border border-gray-300 rounded-md p-1">
                  <button
                    onClick={() => setViewMode('cards')}
                    className={`px-3 py-1 text-sm rounded transition-colors ${
                      viewMode === 'cards'
                        ? 'bg-sea_green-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Cards
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`px-3 py-1 text-sm rounded transition-colors ${
                      viewMode === 'table'
                        ? 'bg-sea_green-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Table
                  </button>
                </div>
              </div>

              {/* Sort By (only for table view or ungrouped) */}
              {(viewMode === 'table' || groupBy === 'none') && (
                <div>
                  <Label className="text-xs text-gray-600 mb-1 block">Sort By</Label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
                  >
                    <option value="name">Name (A-Z)</option>
                    <option value="species">Species</option>
                    <option value="health">Health (Worst First)</option>
                    <option value="arrival_date">Arrival Date (Newest)</option>
                    <option value="last_fed">Last Fed (Most Urgent)</option>
                  </select>
                </div>
              )}
            </div>

            {/* Export Button */}
            <Button
              onClick={handleExport}
              className="flex items-center gap-2 bg-sea_green-600 hover:bg-sea_green-700 text-white"
            >
              <FileDown className="h-4 w-4" />
              Export to Excel
            </Button>
          </div>

          {/* Data Display - Conditional based on view options */}
          {groupBy === 'habitat' && viewMode === 'cards' && (
            /* Grouped by Habitat - Cards View */
            <div className="space-y-6">
              {habitats.map((habitat) => (
                <Card key={habitat.habitat_id} className="border-l-4 border-l-sea_green-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <MapPin className="h-4 w-4 text-sea_green-600" />
                          {habitat.habitat_name}
                        </CardTitle>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
                          <span>{habitat.environment_type || "N/A"}</span>
                          <span>•</span>
                          <span>{habitat.size || "N/A"}</span>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {habitat.animals.length} / {habitat.animal_capacity}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {habitat.animals.length > 0 ? (
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                        {habitat.animals.map((animal) => (
                          <div
                            key={animal.animal_id}
                            className="border rounded-lg p-3 hover:border-sea_green-400 transition-colors bg-white"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm truncate">{animal.animal_name}</h4>
                                <p className="text-xs text-gray-600 truncate">{animal.species}</p>
                              </div>
                              <Badge variant={getHealthBadge(animal.health_status)} className="text-xs ml-2 capitalize">
                                {animal.health_status}
                              </Badge>
                            </div>
                            <div className="space-y-1 text-xs">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Conservation:</span>
                                <span className="font-medium capitalize">{formatEndangerment(animal.endangerment_status)}</span>
                              </div>
                              {animal.keeper_name && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Keeper:</span>
                                  <span className="font-medium">{animal.keeper_name.split(' ')[0]}</span>
                                </div>
                              )}
                              <div className="pt-1 border-t">
                                {(() => {
                                  if (!animal.last_fed_time) {
                                    return <Badge variant="danger" className="text-xs w-full justify-center">Never Fed</Badge>;
                                  }
                                  const hoursSinceLastFed = (Date.now() - new Date(animal.last_fed_time).getTime()) / (1000 * 60 * 60);
                                  if (hoursSinceLastFed < 24) {
                                    return <Badge variant="success" className="text-xs w-full justify-center">Fed {Math.round(hoursSinceLastFed)}h ago</Badge>;
                                  } else {
                                    return <Badge variant="warning" className="text-xs w-full justify-center">Fed {Math.round(hoursSinceLastFed)}h ago</Badge>;
                                  }
                                })()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4 text-sm">No animals in this habitat</p>
                    )}
                  </CardContent>
                </Card>
              ))}
              {habitats.length === 0 && (
                <Card>
                  <CardContent className="py-12 text-center">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No data found matching the selected criteria.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {groupBy === 'habitat' && viewMode === 'table' && (
            /* Grouped by Habitat - Table View */
            <div className="space-y-6">
              {habitats.map((habitat) => (
                <Card key={habitat.habitat_id} className="border-l-4 border-l-sea_green-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <MapPin className="h-4 w-4 text-sea_green-600" />
                        {habitat.habitat_name}
                      </CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {habitat.animals.length} / {habitat.animal_capacity} animals
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    {habitat.animals.length > 0 ? (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Species</TableHead>
                              <TableHead>Health</TableHead>
                              <TableHead>Conservation</TableHead>
                              <TableHead>Keeper</TableHead>
                              <TableHead>Last Fed</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {habitat.animals.map((animal) => (
                              <TableRow key={animal.animal_id}>
                                <TableCell className="font-medium">{animal.animal_name}</TableCell>
                                <TableCell className="text-sm">{animal.species}</TableCell>
                                <TableCell>
                                  <Badge variant={getHealthBadge(animal.health_status)} className="text-xs capitalize">
                                    {animal.health_status}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-sm capitalize">{formatEndangerment(animal.endangerment_status)}</TableCell>
                                <TableCell className="text-sm">{animal.keeper_name || 'Unassigned'}</TableCell>
                                <TableCell className="text-sm">
                                  {animal.last_fed_time ? (
                                    <span>{Math.round((Date.now() - new Date(animal.last_fed_time).getTime()) / (1000 * 60 * 60))}h ago</span>
                                  ) : (
                                    <span className="text-red-600">Never</span>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-6 text-sm">No animals in this habitat</p>
                    )}
                  </CardContent>
                </Card>
              ))}
              {habitats.length === 0 && (
                <Card>
                  <CardContent className="py-12 text-center">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No data found matching the selected criteria.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {groupBy === 'keeper' && viewMode === 'cards' && (
            /* Grouped by Keeper - Cards View */
            <div className="space-y-6">
              {keepers.map((keeper) => (
                <Card key={keeper.keeper_id || 'unassigned'} className="border-l-4 border-l-dark_spring_green-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <User className="h-4 w-4 text-dark_spring_green-600" />
                        {keeper.keeper_name || 'Unassigned Animals'}
                      </CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {keeper.animals.length} animal{keeper.animals.length !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                      {keeper.animals.map((animal) => (
                        <div
                          key={animal.animal_id}
                          className="border rounded-lg p-3 hover:border-sea_green-400 transition-colors bg-white"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm truncate">{animal.animal_name}</h4>
                              <p className="text-xs text-gray-600 truncate">{animal.species}</p>
                            </div>
                            <Badge variant={getHealthBadge(animal.health_status)} className="text-xs ml-2 capitalize">
                              {animal.health_status}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Habitat:</span>
                              <span className="font-medium truncate ml-2">{animal.habitat_name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Conservation:</span>
                              <span className="font-medium capitalize">{formatEndangerment(animal.endangerment_status)}</span>
                            </div>
                            <div className="pt-1 border-t">
                              {(() => {
                                if (!animal.last_fed_time) {
                                  return <Badge variant="danger" className="text-xs w-full justify-center">Never Fed</Badge>;
                                }
                                const hoursSinceLastFed = (Date.now() - new Date(animal.last_fed_time).getTime()) / (1000 * 60 * 60);
                                if (hoursSinceLastFed < 24) {
                                  return <Badge variant="success" className="text-xs w-full justify-center">Fed {Math.round(hoursSinceLastFed)}h ago</Badge>;
                                } else {
                                  return <Badge variant="warning" className="text-xs w-full justify-center">Fed {Math.round(hoursSinceLastFed)}h ago</Badge>;
                                }
                              })()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
              {keepers.length === 0 && (
                <Card>
                  <CardContent className="py-12 text-center">
                    <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No animals found matching the selected criteria.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {groupBy === 'keeper' && viewMode === 'table' && (
            /* Grouped by Keeper - Table View */
            <div className="space-y-6">
              {keepers.map((keeper) => (
                <Card key={keeper.keeper_id || 'unassigned'} className="border-l-4 border-l-dark_spring_green-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <User className="h-4 w-4 text-dark_spring_green-600" />
                        {keeper.keeper_name || 'Unassigned Animals'}
                      </CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {keeper.animals.length} animal{keeper.animals.length !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Species</TableHead>
                            <TableHead>Habitat</TableHead>
                            <TableHead>Health</TableHead>
                            <TableHead>Conservation</TableHead>
                            <TableHead>Last Fed</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {keeper.animals.map((animal) => (
                            <TableRow key={animal.animal_id}>
                              <TableCell className="font-medium">{animal.animal_name}</TableCell>
                              <TableCell className="text-sm">{animal.species}</TableCell>
                              <TableCell className="text-sm">{animal.habitat_name}</TableCell>
                              <TableCell>
                                <Badge variant={getHealthBadge(animal.health_status)} className="text-xs capitalize">
                                  {animal.health_status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm capitalize">{formatEndangerment(animal.endangerment_status)}</TableCell>
                              <TableCell className="text-sm">
                                {animal.last_fed_time ? (
                                  <span>{Math.round((Date.now() - new Date(animal.last_fed_time).getTime()) / (1000 * 60 * 60))}h ago</span>
                                ) : (
                                  <span className="text-red-600">Never</span>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {keepers.length === 0 && (
                <Card>
                  <CardContent className="py-12 text-center">
                    <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No animals found matching the selected criteria.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {groupBy === 'none' && viewMode === 'cards' && (
            /* Flat List - Cards View */
            <div>
              {sortedAnimals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {sortedAnimals.map((animal) => (
                    <div
                      key={animal.animal_id}
                      className="border rounded-lg p-3 hover:border-sea_green-400 transition-colors bg-white"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm truncate">{animal.animal_name}</h4>
                          <p className="text-xs text-gray-600 truncate">{animal.species}</p>
                        </div>
                        <Badge variant={getHealthBadge(animal.health_status)} className="text-xs ml-2 capitalize">
                          {animal.health_status}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Habitat:</span>
                          <span className="font-medium truncate ml-2">{animal.habitat_name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Conservation:</span>
                          <span className="font-medium capitalize">{formatEndangerment(animal.endangerment_status)}</span>
                        </div>
                        {animal.keeper_name && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Keeper:</span>
                            <span className="font-medium">{animal.keeper_name.split(' ')[0]}</span>
                          </div>
                        )}
                        <div className="pt-1 border-t">
                          {(() => {
                            if (!animal.last_fed_time) {
                              return <Badge variant="danger" className="text-xs w-full justify-center">Never Fed</Badge>;
                            }
                            const hoursSinceLastFed = (Date.now() - new Date(animal.last_fed_time).getTime()) / (1000 * 60 * 60);
                            if (hoursSinceLastFed < 24) {
                              return <Badge variant="success" className="text-xs w-full justify-center">Fed {Math.round(hoursSinceLastFed)}h ago</Badge>;
                            } else {
                              return <Badge variant="warning" className="text-xs w-full justify-center">Fed {Math.round(hoursSinceLastFed)}h ago</Badge>;
                            }
                          })()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No animals found matching the selected criteria.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {groupBy === 'none' && viewMode === 'table' && (
            /* Flat List - Table View */
            <Card>
              <CardContent className="p-0">
                {sortedAnimals.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Species</TableHead>
                          <TableHead>Habitat</TableHead>
                          <TableHead>Health</TableHead>
                          <TableHead>Conservation</TableHead>
                          <TableHead>Keeper</TableHead>
                          <TableHead>Arrival Date</TableHead>
                          <TableHead>Last Fed</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedAnimals.map((animal) => (
                          <TableRow key={animal.animal_id}>
                            <TableCell className="font-medium">{animal.animal_name}</TableCell>
                            <TableCell className="text-sm">{animal.species}</TableCell>
                            <TableCell className="text-sm">{animal.habitat_name}</TableCell>
                            <TableCell>
                              <Badge variant={getHealthBadge(animal.health_status)} className="text-xs capitalize">
                                {animal.health_status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm capitalize">{formatEndangerment(animal.endangerment_status)}</TableCell>
                            <TableCell className="text-sm">{animal.keeper_name || 'Unassigned'}</TableCell>
                            <TableCell className="text-sm">{animal.arrival_date ? formatDate(animal.arrival_date) : 'N/A'}</TableCell>
                            <TableCell className="text-sm">
                              {animal.last_fed_time ? (
                                <span>{Math.round((Date.now() - new Date(animal.last_fed_time).getTime()) / (1000 * 60 * 60))}h ago</span>
                              ) : (
                                <span className="text-red-600">Never</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No animals found matching the selected criteria.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
