"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { queryService, type AnimalHealthCareParams } from "@/services/query.service";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  // Report state
  const [hasGenerated, setHasGenerated] = useState(false);
  const [data, setData] = useState<AnimalRow[]>([]);
  const [loading, setLoading] = useState(false);

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
          label="Feeding Data Date Range"
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

          {/* Export Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleExport}
              className="flex items-center gap-2 bg-sea_green-600 hover:bg-sea_green-700 text-white"
            >
              <FileDown className="h-4 w-4" />
              Export to Excel
            </Button>
          </div>

          {/* Habitat Cards */}
          <div className="space-y-6">
            {habitats.map((habitat) => (
              <Card key={habitat.habitat_id} className="border-l-4 border-l-sea_green-500">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-sea_green-600" />
                        {habitat.habitat_name}
                      </CardTitle>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                        <span>Environment: {habitat.environment_type || "N/A"}</span>
                        <span>•</span>
                        <span>Size: {habitat.size || "N/A"}</span>
                        <span>•</span>
                        <Badge variant="outline" className="capitalize">
                          {habitat.habitat_status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">
                        {habitat.animals.length} / {habitat.animal_capacity} animals
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        Last maintenance: {formatDate(habitat.last_maintenance)}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {habitat.animals.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {habitat.animals.map((animal) => (
                        <div
                          key={animal.animal_id}
                          className="border rounded-lg p-4 hover:border-sea_green-400 transition-colors bg-white"
                        >
                          {/* Animal Header */}
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-semibold text-lg flex items-center gap-2">
                                <Leaf className="h-4 w-4 text-sea_green-600" />
                                {animal.animal_name}
                              </h4>
                              <p className="text-sm text-gray-600">{animal.species}</p>
                            </div>
                            <Badge
                              variant={getHealthBadge(animal.health_status)}
                              className="capitalize"
                            >
                              {animal.health_status}
                            </Badge>
                          </div>

                          {/* Animal Details Grid */}
                          <div className="space-y-2 text-sm">
                            {/* Status & Weight */}
                            <div className="flex justify-between">
                              <span className="text-gray-600">Status:</span>
                              <Badge variant="outline" className="capitalize">
                                {animal.active_status}
                              </Badge>
                            </div>

                            {animal.weight && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Weight:</span>
                                <span className="font-medium">{animal.weight} kg</span>
                              </div>
                            )}

                            {/* Endangerment */}
                            <div className="flex justify-between">
                              <span className="text-gray-600">Conservation:</span>
                              <Badge
                                variant={
                                  ['endangered', 'critically_endangered'].includes(animal.endangerment_status || '')
                                    ? "danger"
                                    : "secondary"
                                }
                                className="capitalize text-xs"
                              >
                                {formatEndangerment(animal.endangerment_status)}
                              </Badge>
                            </div>

                            {/* Keeper Assignment */}
                            {animal.keeper_name && (
                              <div className="flex justify-between items-center pt-2 border-t">
                                <span className="text-gray-600 flex items-center gap-1">
                                  <User className="h-3 w-3" /> Keeper:
                                </span>
                                <span className="font-medium text-xs">
                                  {animal.keeper_name}
                                  {animal.keeper_shift && ` (${animal.keeper_shift})`}
                                </span>
                              </div>
                            )}

                            {/* Feeding Info */}
                            <div className="pt-2 border-t space-y-1">
                              <div className="flex items-center gap-1 text-gray-700 font-medium">
                                <Calendar className="h-3 w-3" />
                                <span>Feeding Information</span>
                              </div>

                              {animal.scheduled_food && (
                                <div className="text-xs text-gray-600 pl-4">
                                  <span className="font-medium">Schedule:</span> {animal.scheduled_food}
                                  {animal.feeding_frequency && ` (${animal.feeding_frequency})`}
                                  {animal.scheduled_time && ` at ${formatTime(animal.scheduled_time)}`}
                                </div>
                              )}

                              <div className="text-xs text-gray-600 pl-4">
                                <span className="font-medium">Last Fed:</span>{" "}
                                {animal.last_fed_time
                                  ? new Date(animal.last_fed_time).toLocaleString()
                                  : "No record"}
                              </div>

                              {animal.last_food_given && (
                                <div className="text-xs text-gray-600 pl-4">
                                  <span className="font-medium">Last Food:</span> {animal.last_food_given}
                                </div>
                              )}

                              <div className="text-xs pl-4">
                                <Badge
                                  variant={animal.feeding_logs_count > 0 ? "success" : "warning"}
                                  className="text-xs"
                                >
                                  {animal.feeding_logs_count} feeding logs in period
                                </Badge>
                              </div>
                            </div>

                            {/* Medical Notes */}
                            {animal.medical_notes && (
                              <div className="pt-2 border-t">
                                <div className="flex items-start gap-1">
                                  <AlertTriangle className="h-3 w-3 text-persian_orange-600 mt-0.5" />
                                  <div className="flex-1">
                                    <span className="text-xs font-medium text-gray-700">Medical Notes:</span>
                                    <p className="text-xs text-gray-600 mt-0.5">{animal.medical_notes}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No animals in this habitat
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Data State */}
          {habitats.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  No data found matching the selected criteria. Try adjusting your filters.
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
