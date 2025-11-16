"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
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
import { MapPin, Leaf, Heart, Calendar, User, FileDown, AlertTriangle, ArrowUpDown, ArrowUp, ArrowDown, Filter, X, Search } from "lucide-react";
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
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [viewSize, setViewSize] = useState<3 | 4 | 5>(4);

  // Filter modal state
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterSearch, setFilterSearch] = useState('');
  const [selectedHabitats, setSelectedHabitats] = useState<number[]>([]);
  const [selectedKeepers, setSelectedKeepers] = useState<number[]>([]);

  // Parameters - all filters enabled by default
  const [params, setParams] = useState<AnimalHealthCareParams>({
    startDate: '',
    endDate: '',
    habitatStatus: ['active', 'maintenance', 'renovation', 'closed'],
    healthStatus: ['excellent', 'good', 'fair', 'poor', 'critical'],
    endangerment: ['least_concern', 'near_threatened', 'vulnerable', 'endangered', 'critically_endangered', 'extinct_in_the_wild'],
    includeDeleted: false
  });

  // Reusable sorting function for any array of animals
  const sortAnimals = useCallback((animals: AnimalRow[]) => {
    const sorted = [...animals];

    switch (sortBy) {
      case 'name':
        sorted.sort((a, b) => (a.animal_name || '').localeCompare(b.animal_name || ''));
        break;
      case 'species':
        sorted.sort((a, b) => (a.species || '').localeCompare(b.species || ''));
        break;
      case 'health':
        const healthOrder = { 'critical': 0, 'poor': 1, 'fair': 2, 'good': 3, 'excellent': 4 };
        sorted.sort((a, b) =>
          (healthOrder[a.health_status as keyof typeof healthOrder] || 5) -
          (healthOrder[b.health_status as keyof typeof healthOrder] || 5)
        );
        break;
      case 'arrival_date':
        sorted.sort((a, b) => {
          if (!a.arrival_date) return 1;
          if (!b.arrival_date) return -1;
          return new Date(b.arrival_date).getTime() - new Date(a.arrival_date).getTime();
        });
        break;
      case 'last_fed':
        sorted.sort((a, b) => {
          if (!a.last_fed_time) return 1;
          if (!b.last_fed_time) return -1;
          return new Date(a.last_fed_time).getTime() - new Date(b.last_fed_time).getTime();
        });
        break;
    }

    // Apply sort direction (use slice to avoid mutation issues)
    return sortDirection === 'desc' ? sorted.slice().reverse() : sorted;
  }, [sortBy, sortDirection]);

  // Get unique habitats and keepers from data
  const allHabitatOptions = useMemo(() => {
    if (data.length === 0) return [];
    const seen = new Set<number>();
    const uniqueHabitats: {id: number; name: string}[] = [];
    for (const row of data) {
      if (!seen.has(row.habitat_id)) {
        seen.add(row.habitat_id);
        uniqueHabitats.push({ id: row.habitat_id, name: row.habitat_name });
      }
    }
    return uniqueHabitats.sort((a, b) => a.name.localeCompare(b.name));
  }, [data]);

  const allKeeperOptions = useMemo(() => {
    if (data.length === 0) return [];
    const seen = new Set<number>();
    const uniqueKeepers: {id: number; name: string}[] = [];
    for (const row of data) {
      if (row.keeper_id && !seen.has(row.keeper_id) && row.keeper_name) {
        seen.add(row.keeper_id);
        uniqueKeepers.push({ id: row.keeper_id, name: row.keeper_name });
      }
    }
    // Add unassigned option if there are animals without keepers
    const hasUnassigned = data.some(row => row.animal_id && !row.keeper_id);
    if (hasUnassigned) {
      uniqueKeepers.push({ id: -1, name: 'Unassigned Animals' });
    }
    return uniqueKeepers.sort((a, b) => a.name.localeCompare(b.name));
  }, [data]);

  // Initialize selections when data changes
  useEffect(() => {
    if (data.length > 0 && allHabitatOptions.length > 0 && selectedHabitats.length === 0) {
      setSelectedHabitats(allHabitatOptions.map(h => h.id));
    }
  }, [data.length, allHabitatOptions, selectedHabitats.length]);

  useEffect(() => {
    if (data.length > 0 && allKeeperOptions.length > 0 && selectedKeepers.length === 0) {
      setSelectedKeepers(allKeeperOptions.map(k => k.id));
    }
  }, [data.length, allKeeperOptions, selectedKeepers.length]);

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
      // Only add animal if it's not already in this habitat's animals array (deduplicate)
      if (row.animal_id && !acc[row.habitat_id].animals.some(a => a.animal_id === row.animal_id)) {
        acc[row.habitat_id].animals.push(row);
      }
      return acc;
    }, {});

    // Sort animals within each habitat and create fresh objects
    const habitatArray = Object.values(groups).map(habitat => ({
      ...habitat,
      animals: sortAnimals(habitat.animals)
    }));

    // Filter by selected habitats
    return habitatArray.filter(h => selectedHabitats.includes(h.habitat_id));
  }, [data, sortAnimals, selectedHabitats]);

  // Get flat list of all animals (for ungrouped view) - deduplicate by animal_id
  const allAnimals: AnimalRow[] = useMemo(() => {
    const seen = new Set<number>();
    const uniqueAnimals: AnimalRow[] = [];

    for (const row of data) {
      if (row.animal_id && !seen.has(row.animal_id)) {
        seen.add(row.animal_id);
        uniqueAnimals.push(row);
      }
    }

    return uniqueAnimals;
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

      // Only add animal if it's not already in this keeper's animals array (deduplicate)
      if (!acc[keeperKey].animals.some(a => a.animal_id === row.animal_id)) {
        acc[keeperKey].animals.push(row);
      }
      return acc;
    }, {});

    // Sort animals within each keeper group and create fresh objects
    const groupArray = Object.values(groups).map(keeper => ({
      ...keeper,
      animals: sortAnimals(keeper.animals)
    }));

    // Filter by selected keepers (treat null keeper_id as -1 for unassigned)
    const filteredGroups = groupArray.filter(g =>
      selectedKeepers.includes(g.keeper_id ?? -1)
    );

    // Sort keepers: assigned keepers first (alphabetically), then unassigned
    const assigned = filteredGroups.filter(g => g.keeper_id !== null).sort((a, b) =>
      (a.keeper_name || '').localeCompare(b.keeper_name || '')
    );
    const unassigned = filteredGroups.filter(g => g.keeper_id === null);

    return [...assigned, ...unassigned];
  }, [data, sortAnimals, selectedKeepers]);

  // Sorted animals for ungrouped view
  const sortedAnimals = useMemo(() => sortAnimals(allAnimals), [allAnimals, sortAnimals]);

  // Determine if sort should be visible (only when groupBy=none OR single selection)
  const shouldShowSort = useMemo(() => {
    if (groupBy === 'none') return true;
    if (groupBy === 'habitat') return selectedHabitats.length === 1;
    if (groupBy === 'keeper') return selectedKeepers.length === 1;
    return false;
  }, [groupBy, selectedHabitats.length, selectedKeepers.length]);

  // Handle groupBy change - reset to all selections
  const handleGroupByChange = (newGroupBy: 'habitat' | 'keeper' | 'none') => {
    setGroupBy(newGroupBy);
    setFilterSearch('');
  };

  // Modal filter handlers
  const currentFilterOptions = groupBy === 'habitat' ? allHabitatOptions : allKeeperOptions;
  const currentSelected = groupBy === 'habitat' ? selectedHabitats : selectedKeepers;
  const setCurrentSelected = groupBy === 'habitat' ? setSelectedHabitats : setSelectedKeepers;

  const filteredOptions = currentFilterOptions.filter(option =>
    option.name.toLowerCase().includes(filterSearch.toLowerCase())
  );

  const toggleSelection = (id: number) => {
    const selected = currentSelected.includes(id)
      ? currentSelected.filter(s => s !== id)
      : [...currentSelected, id];
    setCurrentSelected(selected);
  };

  const selectOnly = (id: number) => {
    setCurrentSelected([id]);
  };

  const selectAll = () => {
    setCurrentSelected(currentFilterOptions.map(o => o.id));
  };

  const deselectAll = () => {
    setCurrentSelected([]);
  };

  // Generate report handler
  const handleGenerate = async () => {
    try {
      setLoading(true);
      // Reset selections to force re-initialization with new data
      setSelectedHabitats([]);
      setSelectedKeepers([]);
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
    setSelectedHabitats([]);
    setSelectedKeepers([]);
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

  const formatWeight = (weight: number | null) => {
    if (!weight) return "N/A";
    return `${weight} lbs`;
  };

  const getGridColsClass = () => {
    switch (viewSize) {
      case 3:
        return 'lg:grid-cols-3';
      case 4:
        return 'lg:grid-cols-4';
      case 5:
        return 'lg:grid-cols-5';
      default:
        return 'lg:grid-cols-4';
    }
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
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

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Unassigned Animals</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-persian_orange-600">
                  {habitats.reduce((sum, h) =>
                    sum + h.animals.filter(a => !a.keeper_name).length, 0
                  )}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Habitat Capacity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-dark_spring_green-600">
                  {(() => {
                    const totalAnimals = habitats.reduce((sum, h) => sum + h.animals.length, 0);
                    const totalCapacity = habitats.reduce((sum, h) => sum + h.animal_capacity, 0);
                    const percent = totalCapacity > 0 ? Math.round((totalAnimals / totalCapacity) * 100) : 0;
                    return `${percent}%`;
                  })()}
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
                <div className="flex items-center gap-2">
                  <select
                    value={groupBy}
                    onChange={(e) => handleGroupByChange(e.target.value as 'habitat' | 'keeper' | 'none')}
                    className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
                  >
                    <option value="habitat">Habitat</option>
                    <option value="keeper">Keeper</option>
                    <option value="none">No Grouping</option>
                  </select>
                  {/* Filter Button - only show when grouping */}
                  {groupBy !== 'none' && (
                    <button
                      onClick={() => setShowFilterModal(true)}
                      className="px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors flex items-center gap-1 text-sm"
                      title={`Filter ${groupBy === 'habitat' ? 'habitats' : 'keepers'}`}
                    >
                      <Filter className="h-4 w-4" />
                      {currentSelected.length} of {currentFilterOptions.length}
                    </button>
                  )}
                </div>
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

              {/* View Size Toggle */}
              {viewMode === 'cards' && (
              <div>
                <Label className="text-xs text-gray-600 mb-1 block">View Size</Label>
                <div className="flex items-center gap-1 border border-gray-300 rounded-md p-1">
                  <button
                    onClick={() => setViewSize(3)}
                    className={`px-3 py-1 text-sm rounded transition-colors ${
                      viewSize === 3
                        ? 'bg-sea_green-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    3
                  </button>
                  <button
                    onClick={() => setViewSize(4)}
                    className={`px-3 py-1 text-sm rounded transition-colors ${
                      viewSize === 4
                        ? 'bg-sea_green-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    4
                  </button>
                  <button
                    onClick={() => setViewSize(5)}
                    className={`px-3 py-1 text-sm rounded transition-colors ${
                      viewSize === 5
                        ? 'bg-sea_green-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    5
                  </button>
                </div>
              </div>
              )}

              {/* Sort By - only show in table view or when appropriate */}
              {shouldShowSort && viewMode === 'table' && (
                <div>
                  <Label className="text-xs text-gray-600 mb-1 block">Sort By</Label>
                  <div className="flex items-center gap-2">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
                    >
                      <option value="name">Name</option>
                      <option value="species">Species</option>
                      <option value="health">Health Status</option>
                      <option value="arrival_date">Arrival Date</option>
                      <option value="last_fed">Last Fed Time</option>
                    </select>
                    <button
                      onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                      className="px-2 py-1.5 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors"
                      title={sortDirection === 'asc' ? 'Sort ascending' : 'Sort descending'}
                    >
                      {sortDirection === 'asc' ? (
                        <ArrowUp className="h-4 w-4 text-gray-600" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-gray-600" />
                      )}
                    </button>
                  </div>
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
            <div key={`habitat-cards-${sortBy}-${sortDirection}`} className="space-y-6">
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
  <div className={`grid grid-cols-1 ${getGridColsClass()} gap-3`}> {/* lg:grid-cols-3 lg:grid-cols-4 lg:grid-cols-5 */} {/* lg:grid-cols-3 lg:grid-cols-4 lg:grid-cols-5 */}{habitat.animals.map((animal) => (
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
                                  <span className="font-medium">{animal.keeper_name}</span>
                                </div>
                              )}
                              <div className="flex justify-between">
                                <span className="text-gray-600">Weight:</span>
                                <span className="font-medium">{formatWeight(animal.weight)}</span>
                              </div>
                              <div className="pt-1 border-t">
                                {(() => {
                                  if (!animal.last_fed_time) {
                                    return <Badge variant="danger" className="text-xs justify-center">Never Fed</Badge>;
                                    }
                                    const hoursSinceLastFed = (Date.now() - new Date(animal.last_fed_time).getTime()) / (1000 * 60 * 60);
                                    if (hoursSinceLastFed < 24) {
                                      return <Badge variant="success" className="text-xs justify-center">Fed {Math.round(hoursSinceLastFed)}h ago</Badge>;
                                    } else {
                                      return <Badge variant="warning" className="text-xs justify-center">Fed {Math.round(hoursSinceLastFed)}h ago</Badge>;
                                    }                                })()}
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
            <div key={`habitat-table-${sortBy}-${sortDirection}`} className="space-y-6">
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
                              <TableHead>Weight</TableHead>
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
                                <TableCell className="text-sm">{formatWeight(animal.weight)}</TableCell>
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
            <div key={`keeper-cards-${sortBy}-${sortDirection}`} className="space-y-6">
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
                    <div className={`grid grid-cols-1 ${getGridColsClass()} gap-3`}> {/* lg:grid-cols-3 lg:grid-cols-4 lg:grid-cols-5 */}
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
                            <div className="flex justify-between">
                              <span className="text-gray-600">Weight:</span>
                              <span className="font-medium">{formatWeight(animal.weight)}</span>
                            </div>
                            <div className="pt-1 border-t">
                              {(() => {
                                if (!animal.last_fed_time) {
                                  return <Badge variant="danger" className="text-xs justify-center">Never Fed</Badge>;
                                  }
                                  const hoursSinceLastFed = (Date.now() - new Date(animal.last_fed_time).getTime()) / (1000 * 60 * 60);
                                  if (hoursSinceLastFed < 24) {
                                    return <Badge variant="success" className="text-xs justify-center">Fed {Math.round(hoursSinceLastFed)}h ago</Badge>;
                                  } else {
                                    return <Badge variant="warning" className="text-xs justify-center">Fed {Math.round(hoursSinceLastFed)}h ago</Badge>;
                                  }                              })()}
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
            <div key={`keeper-table-${sortBy}-${sortDirection}`} className="space-y-6">
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
                            <TableHead>Weight</TableHead>
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
                              <TableCell className="text-sm">{formatWeight(animal.weight)}</TableCell>
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
            <div key={`ungrouped-cards-${sortBy}-${sortDirection}`}>
              {sortedAnimals.length > 0 ? (
                <div className={`grid grid-cols-1 ${getGridColsClass()} gap-3`}> {/* lg:grid-cols-3 lg:grid-cols-4 lg:grid-cols-5 */}
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
                            <span className="font-medium">{animal.keeper_name}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-600">Weight:</span>
                          <span className="font-medium">{formatWeight(animal.weight)}</span>
                        </div>
                        <div className="pt-1 border-t">
                          {(() => {
                            if (!animal.last_fed_time) {
                              return <Badge variant="danger" className="text-xs justify-center">Never Fed</Badge>;
                              }
                              const hoursSinceLastFed = (Date.now() - new Date(animal.last_fed_time).getTime()) / (1000 * 60 * 60);
                              if (hoursSinceLastFed < 24) {
                                return <Badge variant="success" className="text-xs justify-center">Fed {Math.round(hoursSinceLastFed)}h ago</Badge>;
                              } else {
                                return <Badge variant="warning" className="text-xs justify-center">Fed {Math.round(hoursSinceLastFed)}h ago</Badge>;
                              }                          })()}
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
            <Card key={`ungrouped-table-${sortBy}-${sortDirection}`}>
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
                          <TableHead>Weight</TableHead>
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
                            <TableCell className="text-sm">{formatWeight(animal.weight)}</TableCell>
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

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowFilterModal(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Select {groupBy === 'habitat' ? 'Habitats' : 'Keepers'}
              </h3>
              <button
                onClick={() => setShowFilterModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Search Field */}
            <div className="px-6 py-3 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={filterSearch}
                  onChange={(e) => setFilterSearch(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-sea_green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-6 py-3 border-b border-gray-200 flex gap-2">
              <Button
                onClick={selectAll}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                Select All
              </Button>
              <Button
                onClick={deselectAll}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                Deselect All
              </Button>
            </div>

            {/* Scrollable List */}
            <div className="flex-1 overflow-y-auto px-6 py-3">
              <div className="space-y-2">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => (
                    <div
                      key={option.id}
                      className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 transition-colors"
                    >
                      <input
                        type="checkbox"
                        id={`option-${option.id}`}
                        checked={currentSelected.includes(option.id)}
                        onChange={() => toggleSelection(option.id)}
                        className="rounded border-gray-300 text-sea_green-600 focus:ring-sea_green-500"
                      />
                      <label
                        htmlFor={`option-${option.id}`}
                        className="flex-1 text-sm text-gray-700 cursor-pointer"
                      >
                        {option.name}
                      </label>
                      <button
                        onClick={() => selectOnly(option.id)}
                        className="px-2 py-1 text-xs rounded border border-gray-300 hover:bg-gray-100 transition-colors text-gray-600"
                        title="Select only this"
                      >
                        Only
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No matches found
                  </p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-2">
              <Button
                onClick={() => setShowFilterModal(false)}
                variant="outline"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
