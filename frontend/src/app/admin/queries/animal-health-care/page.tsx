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
  const [groupByHabitat, setGroupByHabitat] = useState(true);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Parameters
  const [params, setParams] = useState<AnimalHealthCareParams>({
    startDate: '',
    endDate: '',
    habitatStatus: 'all',
    healthStatus: 'all',
    endangerment: 'all',
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
      habitatStatus: 'all',
      healthStatus: 'all',
      endangerment: 'all',
      includeDeleted: false
    });
    setHasGenerated(false);
    setData([]);
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
      <ReportParametersCard>
        <DateRangePicker
          startDate={params.startDate || ''}
          endDate={params.endDate || ''}
          onRangeChange={(startDate, endDate) => setParams({ ...params, startDate, endDate })}
          label="Animal Arrival Date Range (Optional)"
          required={false}
          showQuickSelect={true}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Habitat Status Filter */}
          <div>
            <Label htmlFor="habitatStatus" className="text-sm font-medium text-gray-700">
              Habitat Status
            </Label>
            <select
              id="habitatStatus"
              value={params.habitatStatus}
              onChange={(e) => setParams({ ...params, habitatStatus: e.target.value })}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="maintenance">Maintenance</option>
              <option value="renovation">Renovation</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Health Status Filter */}
          <div>
            <Label htmlFor="healthStatus" className="text-sm font-medium text-gray-700">
              Health Status
            </Label>
            <select
              id="healthStatus"
              value={params.healthStatus}
              onChange={(e) => setParams({ ...params, healthStatus: e.target.value })}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="all">All Health Levels</option>
              <option value="needs_attention">Needs Attention (Fair/Poor/Critical)</option>
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          {/* Endangerment Filter */}
          <div>
            <Label htmlFor="endangerment" className="text-sm font-medium text-gray-700">
              Endangerment Status
            </Label>
            <select
              id="endangerment"
              value={params.endangerment}
              onChange={(e) => setParams({ ...params, endangerment: e.target.value })}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="all">All Levels</option>
              <option value="endangered_plus">Endangered or Higher</option>
              <option value="least_concern">Least Concern</option>
              <option value="near_threatened">Near Threatened</option>
              <option value="vulnerable">Vulnerable</option>
              <option value="endangered">Endangered</option>
              <option value="critically_endangered">Critically Endangered</option>
              <option value="extinct_in_the_wild">Extinct in Wild</option>
            </select>
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
            <div className="flex items-center gap-4">
              {/* Group by Habitat Toggle */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="groupByHabitat"
                  checked={groupByHabitat}
                  onChange={(e) => setGroupByHabitat(e.target.checked)}
                  className="rounded border-gray-300 text-sea_green-600 focus:ring-sea_green-500"
                />
                <Label htmlFor="groupByHabitat" className="text-sm text-gray-700 cursor-pointer">
                  Group by Habitat
                </Label>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 border border-gray-300 rounded-md p-1">
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
          {groupByHabitat && viewMode === 'cards' && (
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

          {groupByHabitat && viewMode === 'table' && (
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

          {!groupByHabitat && viewMode === 'cards' && (
            /* Flat List - Cards View */
            <div>
              {allAnimals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {allAnimals.map((animal) => (
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

          {!groupByHabitat && viewMode === 'table' && (
            /* Flat List - Table View */
            <Card>
              <CardContent className="p-0">
                {allAnimals.length > 0 ? (
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
                        {allAnimals.map((animal) => (
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
