"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useState, useCallback, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { queryService } from "@/services/query.service";
import * as XLSX from 'xlsx';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Leaf, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

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

// CSV report modes
const REPORT_TYPES = [
  { value: "full", label: "Full Habitat + Animals" },
  { value: "capacity", label: "Habitat Capacity Summary" },
  { value: "endangered", label: "Endangered Animals Only" },
  { value: "health", label: "Animals Needing Attention (Health)" },
];

export default function AnimalsByHabitatPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  const [data, setData] = useState<RawRow[]>([]);
  const [loading, setLoading] = useState(true);

  // user parameter: report type
  const [reportType, setReportType] = useState<string>("full");

  // fetch data
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

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, loadData]);

  // ---------- grouping logic ----------
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

  // ---------- helpers ----------
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

  // ========== Excel helpers ==========

  // Build rows per report type
  const buildRowsForReport = useCallback(
    (type: string): { headers: string[]; rows: string[][] } => {
      if (type === "capacity") {
        // One row per habitat (capacity view)
        const headers = [
          "habitat_id",
          "habitat_name",
          "environment_type",
          "habitat_status",
          "animal_capacity",
          "current_animals",
          "available_space",
        ];

        const rows = habitats.map((h) => {
          const currentCount = h.animals.length;
          const capacity = h.animal_capacity ?? 0;
          const free = capacity - currentCount;

          return [
            String(h.habitat_id ?? ""),
            h.habitat_name ?? "",
            h.environment_type ?? "",
            h.habitat_status ?? "",
            String(capacity),
            String(currentCount),
            String(free),
          ];
        });

        return { headers, rows };
      }

      if (type === "endangered") {
        // One row per animal that has an endangerment_status
        const headers = [
          "animal_id",
          "animal_name",
          "species",
          "endangerment_status",
          "health_status",
          "habitat_id",
          "habitat_name",
        ];

        const rows: string[][] = [];
        habitats.forEach((h) => {
          h.animals.forEach((a) => {
            if (!a.endangerment_status) return;

            rows.push([
              String(a.animal_id ?? ""),
              a.animal_name ?? "",
              a.species ?? "",
              a.endangerment_status ?? "",
              a.health_status ?? "",
              String(h.habitat_id ?? ""),
              h.habitat_name ?? "",
            ]);
          });
        });

        return { headers, rows };
      }

      if (type === "health") {
        // Animals with non-ideal health (not excellent/good)
        const headers = [
          "animal_id",
          "animal_name",
          "species",
          "health_status",
          "active_status",
          "habitat_id",
          "habitat_name",
        ];

        const rows: string[][] = [];
        habitats.forEach((h) => {
          h.animals.forEach((a) => {
            const hs = (a.health_status || "").toLowerCase();
            const needsAttention = hs && hs !== "excellent" && hs !== "good";
            if (!needsAttention) return;

            rows.push([
              String(a.animal_id ?? ""),
              a.animal_name ?? "",
              a.species ?? "",
              a.health_status ?? "",
              a.active_status ?? "",
              String(h.habitat_id ?? ""),
              h.habitat_name ?? "",
            ]);
          });
        });

        return { headers, rows };
      }

      // default: "full"
      // One row per animal, or 1 row for empty habitat
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

      const rows: string[][] = [];

      habitats.forEach((h) => {
        if (h.animals.length === 0) {
          rows.push([
            String(h.habitat_id ?? ""),
            h.habitat_name ?? "",
            h.environment_type ?? "",
            String(h.animal_capacity ?? ""),
            h.habitat_status ?? "",
            "", // animal_id
            "", // animal_name
            "", // species
            "", // health_status
            "", // active_status
            "", // endangerment_status
          ]);
          return;
        }

        h.animals.forEach((a) => {
          rows.push([
            String(h.habitat_id ?? ""),
            h.habitat_name ?? "",
            h.environment_type ?? "",
            String(h.animal_capacity ?? ""),
            h.habitat_status ?? "",
            String(a.animal_id ?? ""),
            a.animal_name ?? "",
            a.species ?? "",
            a.health_status ?? "",
            a.active_status ?? "",
            a.endangerment_status ?? "",
          ]);
        });
      });

      return { headers, rows };
    },
    [habitats]
  );

  // Excel export with formatting
  const handleGenerateExcel = useCallback(() => {
    const wb = XLSX.utils.book_new();
    const { headers, rows } = buildRowsForReport(reportType);

    // Build worksheet data
    const wsData: any[][] = [];

    // Title
    wsData.push(['Animals by Habitat Report']);
    wsData.push(['Generated: ' + new Date().toLocaleDateString()]);
    wsData.push([]); // blank

    // Summary
    wsData.push(['Report Type:', reportType]);
    wsData.push(['Total Habitats:', String(habitats.length)]);
    wsData.push(['Total Animals:', String(habitats.reduce((sum, h) => sum + h.animals.length, 0))]);
    wsData.push([]); // blank

    // Headers
    wsData.push(headers);

    // Data rows - convert to proper types
    rows.forEach((row) => {
      const dataRow = row.map((cell) => {
        if (!isNaN(Number(cell)) && cell !== '') {
          return Number(cell);
        }
        return cell;
      });
      wsData.push(dataRow);
    });

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Set column widths
    ws['!cols'] = headers.map(() => ({ wch: 20 }));

    // Style title
    if (ws['A1']) {
      ws['A1'].s = {
        font: { bold: true, sz: 16, color: { rgb: "0F766E" } },
        alignment: { horizontal: 'left' }
      };
    }

    // Style summary section
    for (let r = 4; r <= 6; r++) {
      const cellA = ws[XLSX.utils.encode_cell({ r, c: 0 })];
      if (cellA) {
        cellA.s = {
          font: { bold: true },
          fill: { fgColor: { rgb: "D1FAE5" } }
        };
      }
    }

    // Style header row
    const headerRowIndex = 8;
    headers.forEach((_, colIdx) => {
      const cell = ws[XLSX.utils.encode_cell({ r: headerRowIndex, c: colIdx })];
      if (cell) {
        cell.s = {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "0F766E" } },
          alignment: { horizontal: 'center', vertical: 'center' },
          border: {
            top: { style: 'thin', color: { rgb: "000000" } },
            bottom: { style: 'thin', color: { rgb: "000000" } },
            left: { style: 'thin', color: { rgb: "000000" } },
            right: { style: 'thin', color: { rgb: "000000" } }
          }
        };
      }
    });

    // Style data rows
    const dataStartRow = headerRowIndex + 1;
    const dataEndRow = dataStartRow + rows.length - 1;

    for (let r = dataStartRow; r <= dataEndRow; r++) {
      headers.forEach((header, colIdx) => {
        const cell = ws[XLSX.utils.encode_cell({ r, c: colIdx })];
        if (cell) {
          // Borders
          cell.s = cell.s || {};
          cell.s.border = {
            top: { style: 'thin', color: { rgb: "CCCCCC" } },
            bottom: { style: 'thin', color: { rgb: "CCCCCC" } },
            left: { style: 'thin', color: { rgb: "CCCCCC" } },
            right: { style: 'thin', color: { rgb: "CCCCCC" } }
          };

          // Highlight endangered animals
          if (header.toLowerCase().includes('endangerment') && cell.v) {
            const value = String(cell.v).toLowerCase();
            if (value.includes('endangered') || value.includes('critically')) {
              cell.s.fill = { fgColor: { rgb: "FEE2E2" } };
              cell.s.font = { bold: true, color: { rgb: "991B1B" } };
            }
          }

          // Highlight health issues
          if (header.toLowerCase().includes('health') && cell.v) {
            const value = String(cell.v).toLowerCase();
            if (value === 'poor' || value === 'critical') {
              cell.s.fill = { fgColor: { rgb: "FEF3C7" } };
              cell.s.font = { color: { rgb: "92400E" } };
            }
          }

          // Zebra striping
          if (r % 2 === 0) {
            cell.s.fill = cell.s.fill || { fgColor: { rgb: "F9FAFB" } };
          }
        }
      });
    }

    XLSX.utils.book_append_sheet(wb, ws, 'Animals by Habitat');

    const fileName = `animals_report_${reportType}_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, fileName);
  }, [reportType, buildRowsForReport, habitats]);

  // ---------- loading / auth UI ----------
  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark_spring_green-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // ---------- render ----------
  return (
    <div className="space-y-6">
      {/* HEADER + CONTROLS */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <MapPin className="h-8 w-8 text-sea_green-600" />
            Animals by Habitat
          </h1>
          <p className="text-gray-600 mt-1">
            View all animals grouped by their habitats, or export a custom
            report.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:items-end">
          {/* Report Type Selector (only control now) */}
          <div className="flex flex-col text-sm">
            <Label className="text-xs text-gray-600 mb-1">Report Type</Label>
            <select
              className="rounded-md border px-2 py-1 text-sm"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              {REPORT_TYPES.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <Button
            onClick={handleGenerateExcel}
            className="flex items-center gap-2 bg-sea_green-600 hover:bg-sea_green-700 text-white self-start sm:self-auto"
          >
            <FileDown className="h-4 w-4" />
            <span>Export Excel</span>
          </Button>
        </div>
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
                        <Badge
                          variant="outline"
                          className="text-xs capitalize"
                        >
                          {animal.active_status || "inactive/unknown"}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="text-xs capitalize"
                        >
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
