"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { queryService } from "@/services/query.service";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Leaf, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";

type RawRow = {
  habitat_id: number;
  habitat_name: string;
  environment_type: string | null;
  animal_capacity: number;
  habitat_status: string;
  animal_id: number | null;
  animal_name: string | null;
  species: string | null;
  health_status: string | null;
  active_status: string | null;
  endangerment_status: string | null;
};

type Animal = {
  animal_id: number | null;
  animal_name: string | null;
  species: string | null;
  health_status: string | null;
  active_status: string | null;
  endangerment_status: string | null;
};

type HabitatGroup = {
  habitat_id: number;
  habitat_name: string;
  environment_type: string | null;
  animal_capacity: number;
  habitat_status: string;
  animals: Animal[];
};

export default function AnimalsByHabitatPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  const [data, setData] = useState<RawRow[]>([]);
  const [loading, setLoading] = useState(true);

  // fetch data (same pattern you already use)
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await queryService.getAnimalsByHabitat();
      setData(result);
    } catch (error) {
      console.error("Failed to load animals by habitat:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // auth + load logic
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, loadData]);

  // ---------- grouping logic (same idea you already wrote) ----------
  const habitats: HabitatGroup[] = useMemo(() => {
    const habitatGroups = data.reduce<Record<number, HabitatGroup>>(
      (groups, item) => {
        const habitatId = item.habitat_id;
        if (!groups[habitatId]) {
          groups[habitatId] = {
            habitat_id: item.habitat_id,
            habitat_name: item.habitat_name,
            environment_type: item.environment_type,
            animal_capacity: item.animal_capacity,
            habitat_status: item.habitat_status,
            animals: [],
          };
        }

        if (item.animal_id) {
          groups[habitatId].animals.push({
            animal_id: item.animal_id,
            animal_name: item.animal_name,
            species: item.species,
            health_status: item.health_status,
            active_status: item.active_status,
            endangerment_status: item.endangerment_status,
          });
        }

        return groups;
      },
      {}
    );

    return Object.values(habitatGroups);
  }, [data]);

  // ---------- helper functions for UI ----------
  const getHealthBadge = (status: string | null) => {
    const variants: Record<string, any> = {
      excellent: "success",
      good: "secondary",
      fair: "warning",
      poor: "danger",
      critical: "danger",
    };
    if (!status) return "default";
    return variants[status] || "default";
  };

  const formatEndangerment = (status: string | null) => {
    if (!status) return "N/A";
    return status.replace(/_/g, " ");
  };

  // ---------- CSV generation logic ----------
  // We'll flatten habitat + animal data into rows like:
  // Habitat Name, Environment, Capacity, Animal Name, Species, Health, Active Status, Endangerment
  const generateCsv = useCallback(() => {
    // build header row
    const headers = [
      "habitat_id",
      "habitat_name",
      "environment_type",
      "animal_capacity",
      "habitat_status",
      "animal_id",
      "animal_name",
      "species",
      "health_status",
      "active_status",
      "endangerment_status",
    ];

    // build data rows
    const rows: string[][] = [];

    // if there are animals, 1 row per animal
    // if a habitat has 0 animals, still include a row for that habitat with blanks
    habitats.forEach((habitat) => {
      if (habitat.animals.length === 0) {
        rows.push([
          String(habitat.habitat_id ?? ""),
          habitat.habitat_name ?? "",
          habitat.environment_type ?? "",
          String(habitat.animal_capacity ?? ""),
          habitat.habitat_status ?? "",
          "", // animal_id
          "", // animal_name
          "", // species
          "", // health_status
          "", // active_status
          "", // endangerment_status
        ]);
      } else {
        habitat.animals.forEach((animal) => {
          rows.push([
            String(habitat.habitat_id ?? ""),
            habitat.habitat_name ?? "",
            habitat.environment_type ?? "",
            String(habitat.animal_capacity ?? ""),
            habitat.habitat_status ?? "",
            String(animal.animal_id ?? ""),
            animal.animal_name ?? "",
            animal.species ?? "",
            animal.health_status ?? "",
            animal.active_status ?? "",
            animal.endangerment_status ?? "",
          ]);
        });
      }
    });

    // convert to CSV text
    const escapeCell = (val: string) => {
      // wrap in quotes if it contains comma, quote, or newline
      if (val.includes(",") || val.includes('"') || val.includes("\n")) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    };

    const csvLines = [
      headers.join(","), // header row
      ...rows.map((row) => row.map(escapeCell).join(",")),
    ];

    const csvContent = csvLines.join("\n");

    // trigger browser download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `animals_by_habitat_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [habitats]);

  // ---------- loading / auth UI states ----------
  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark_spring_green-600"></div>
      </div>
    );
  }

  // if user isn't authenticated, we currently just render nothing (keeps your behavior)
  if (!isAuthenticated) {
    return null;
  }

  // ---------- page render ----------
  return (
    <div className="space-y-6">
      {/* HEADER ROW WITH TITLE + CSV BUTTON */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <MapPin className="h-8 w-8 text-sea_green-600" />
            Animals by Habitat
          </h1>
          <p className="text-gray-600 mt-1">
            View all animals grouped by their habitats
          </p>
        </div>

        <Button
          onClick={generateCsv}
          className="flex items-center gap-2 bg-sea_green-600 hover:bg-sea_green-700 text-white"
        >
          <FileDown className="h-4 w-4" />
          <span>Generate CSV</span>
        </Button>
      </div>

      {/* HABITAT CARDS */}
      <div className="grid grid-cols-1 gap-6">
        {habitats.map((habitat) => (
          <Card key={habitat.habitat_id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-sea_green-600" />
                    <span>{habitat.habitat_name}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                    <span>
                      Environment: {habitat.environment_type || "N/A"}
                    </span>
                    <Badge variant="outline" className="capitalize">
                      {habitat.habitat_status}
                    </Badge>
                  </div>
                </div>

                <Badge variant="outline">
                  {habitat.animals.length} / {habitat.animal_capacity} animals
                </Badge>
              </CardTitle>
            </CardHeader>

            <CardContent>
              {habitat.animals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {habitat.animals.map((animal) => (
                    <div
                      key={animal.animal_id ?? `${habitat.habitat_id}-empty`}
                      className="p-4 border rounded-lg hover:border-sea_green-400 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Leaf className="h-4 w-4 text-sea_green-600" />
                          <h3 className="font-semibold">
                            {animal.animal_name || "Unnamed"}
                          </h3>
                        </div>

                        <Badge
                          variant={getHealthBadge(animal.health_status)}
                          className="text-xs capitalize"
                        >
                          {animal.health_status || "unknown"}
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-600 mb-2">
                        {animal.species || "No species recorded"}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs capitalize">
                          {animal.active_status || "inactive/unknown"}
                        </Badge>
                        <Badge variant="secondary" className="text-xs capitalize">
                          {formatEndangerment(animal.endangerment_status)}
                        </Badge>
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

      {habitats.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No habitats found</p>
        </div>
      )}
    </div>
  );
}
