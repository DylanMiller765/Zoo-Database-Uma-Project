"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { queryService } from "@/services/query.service";
import apiClient from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MapPin, Leaf, Download, Eye } from "lucide-react";
import { Modal } from "@/components/ui/modal";

/** ------------ Types ------------- */
type AnimalsByHabitatRow = {
  habitat_id: number;
  habitat_name: string;
  environment_type?: string;
  animal_capacity?: number;
  habitat_status?: string;
  animal_id?: number | null;
  animal_name?: string | null;
  species?: string | null;
  health_status?: string | null;
  active_status?: string | null;
  endangerment_status?: string | null;
};

type HabitatEntity = {
  habitat_id: number;
  attraction_id?: number | null;
  name?: string;
  environment_type?: string | null;
  animal_capacity?: number | null;
  status?: string | null;
};

type AttractionEntity = {
  attraction_id: number;
  name: string;
  status?: string | null;
};

const titleCase = (s?: string | null) =>
  s ? s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "N/A";

export default function AnimalsByHabitatPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  /** -------- Source data -------- */
  const [animalsByHabitat, setAnimalsByHabitat] = useState<AnimalsByHabitatRow[]>([]);
  const [habitatsList, setHabitatsList] = useState<HabitatEntity[]>([]);
  const [attractionsList, setAttractionsList] = useState<AttractionEntity[]>([]);
  const [loading, setLoading] = useState(true);

  /** -------- Report controls (no date range) -------- */
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // All checked by default
  const [cols, setCols] = useState<Record<string, boolean>>({
    // attraction
    Attraction: true,
    AttractionStatus: true,
    // habitat
    Habitat: true,
    Environment: true,
    Capacity: true,
    HabitatStatus: true,
    // animal
    Animal: true,
    Species: true,
    Health: true,
    AnimalStatus: true,
    Endangerment: true,
  });

  const selectAllCols = () =>
    setCols((prev) => Object.fromEntries(Object.keys(prev).map((k) => [k, true])) as Record<
      string,
      boolean
    >);

  const unselectAllCols = () =>
    setCols((prev) => Object.fromEntries(Object.keys(prev).map((k) => [k, false])) as Record<
      string,
      boolean
    >);

  useEffect(() => {
    if (isAuthenticated) void loadData();
  }, [isAuthenticated]);

  const safeArr = (payload: any): any[] =>
    Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : [];

  const loadData = async () => {
    try {
      setLoading(true);

      // animals by habitat
      let abH: AnimalsByHabitatRow[] = [];
      try {
        const r = await (queryService as any).getAnimalsByHabitat?.();
        if (Array.isArray(r)) abH = r;
      } catch {}

      // habitats + attractions
      const [hList, aList] = await Promise.all([
        apiClient.get<HabitatEntity[]>("/habitats"),
        apiClient.get<AttractionEntity[]>("/attractions"),
      ]);

      setAnimalsByHabitat(abH as AnimalsByHabitatRow[]);
      setHabitatsList(safeArr(hList.data));
      setAttractionsList(safeArr(aList.data));
    } finally {
      setLoading(false);
    }
  };

  /** -------- Existing habitat cards (unchanged visuals) -------- */
  const habitatGroups = useMemo(() => {
    const groups: Record<
      number,
      {
        habitat_id: number;
        habitat_name: string;
        environment_type?: string;
        animal_capacity?: number;
        habitat_status?: string;
        animals: any[];
      }
    > = {};
    for (const item of animalsByHabitat) {
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
    }
    return groups;
  }, [animalsByHabitat]);

  const habitats = useMemo(() => Object.values(habitatGroups), [habitatGroups]);

  /** -------- Build merged report (Attractions ⇄ Habitats ⇄ Animals) -------- */
  const attractionsById = useMemo(() => {
    const map = new Map<number, AttractionEntity>();
    for (const a of attractionsList) if (a && a.attraction_id != null) map.set(a.attraction_id, a);
    return map;
  }, [attractionsList]);

  const attractionIdByHabitatId = useMemo(() => {
    const map = new Map<number, number | undefined>();
    for (const h of habitatsList) map.set(h.habitat_id, h.attraction_id ?? undefined);
    return map;
  }, [habitatsList]);

  const reportRows = useMemo(() => {
    const rows: Array<Record<string, any>> = [];
    for (const h of animalsByHabitat) {
      const attrId = attractionIdByHabitatId.get(h.habitat_id);
      const attr = attrId != null ? attractionsById.get(attrId) : undefined;

      const base = {
        Attraction: attr?.name || "",
        AttractionStatus: titleCase(attr?.status),
        Habitat: h.habitat_name,
        Environment: h.environment_type || "",
        Capacity: h.animal_capacity ?? "",
        HabitatStatus: h.habitat_status || "",
      };

      if (h.animal_id) {
        rows.push({
          ...base,
          Animal: h.animal_name || "",
          Species: h.species || "",
          Health: h.health_status || "",
          AnimalStatus: h.active_status || "",
          Endangerment: titleCase(h.endangerment_status),
        });
      } else {
        rows.push({
          ...base,
          Animal: "",
          Species: "",
          Health: "",
          AnimalStatus: "",
          Endangerment: "",
        });
      }
    }
    return rows;
  }, [animalsByHabitat, attractionIdByHabitatId, attractionsById]);

  /** -------- Selected column order -------- */
  const selectedHeaders = useMemo(
    () => Object.keys(cols).filter((k) => cols[k]),
    [cols]
  );

  /** -------- CSV -------- */
  const downloadCSV = () => {
    if (selectedHeaders.length === 0 || reportRows.length === 0) return;
    const escape = (val: any) => {
      const s = String(val ?? "");
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const lines = [
      selectedHeaders.join(","),
      ...reportRows.map((row) => selectedHeaders.map((h) => escape(row[h])).join(",")),
    ];
    const csv = lines.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "animals_habitats_attractions_report.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  /** -------- Badge helpers (unchanged) -------- */
  const getHealthBadge = (status: string) => {
    const variants: Record<string, any> = {
      excellent: "success",
      good: "secondary",
      fair: "warning",
      poor: "danger",
      critical: "danger",
    };
    return variants[status] || "default";
  };

  /** -------- Render -------- */
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
      {/* Header + actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <MapPin className="h-8 w-8 text-sea_green-600" />
            Animals by Habitat
          </h1>
          <p className="text-gray-600 mt-1">View all animals grouped by their habitats</p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsPreviewOpen(true)}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Preview Report
          </Button>
          <Button onClick={downloadCSV} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download CSV
          </Button>
        </div>
      </div>

      {/* Report Options (Select/Unselect All) */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-lg">Report Options</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={unselectAllCols}>
              Unselect All
            </Button>
            <Button variant="outline" size="sm" onClick={selectAllCols}>
              Select All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-6">
            {/* Attraction */}
            <div>
              <p className="text-sm font-medium mb-1">Attraction</p>
              {["Attraction", "AttractionStatus"].map((key) => (
                <label key={key} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={!!cols[key]}
                    onChange={() => setCols((c) => ({ ...c, [key]: !c[key] }))}
                  />
                  {key.replace(/([A-Z])/g, " $1")}
                </label>
              ))}
            </div>

            {/* Habitat */}
            <div>
              <p className="text-sm font-medium mb-1">Habitat</p>
              {["Habitat", "Environment", "Capacity", "HabitatStatus"].map((key) => (
                <label key={key} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={!!cols[key]}
                    onChange={() => setCols((c) => ({ ...c, [key]: !c[key] }))}
                  />
                  {key.replace(/([A-Z])/g, " $1")}
                </label>
              ))}
            </div>

            {/* Animal */}
            <div>
              <p className="text-sm font-medium mb-1">Animal</p>
              {["Animal", "Species", "Health", "AnimalStatus", "Endangerment"].map((key) => (
                <label key={key} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={!!cols[key]}
                    onChange={() => setCols((c) => ({ ...c, [key]: !c[key] }))}
                  />
                  {key.replace(/([A-Z])/g, " $1")}
                </label>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Existing habitat cards (unchanged visuals) */}
      <div className="grid grid-cols-1 gap-6">
        {(habitats as any[]).map((habitat: any) => (
          <Card key={habitat.habitat_id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-sea_green-600" />
                  <span>{habitat.habitat_name}</span>
                </div>
                <Badge variant="outline">
                  {habitat.animals.length} / {habitat.animal_capacity} animals
                </Badge>
              </CardTitle>
              <p className="text-sm text-gray-600">
                Environment: {habitat.environment_type || "N/A"}
              </p>
            </CardHeader>
            <CardContent>
              {habitat.animals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {habitat.animals.map((animal: any) => (
                    <div
                      key={animal.animal_id}
                      className="p-4 border rounded-lg hover:border-sea_green-400 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Leaf className="h-4 w-4 text-sea_green-600" />
                          <h3 className="font-semibold">{animal.animal_name}</h3>
                        </div>
                        <Badge variant={getHealthBadge(animal.health_status)} className="text-xs">
                          {animal.health_status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{animal.species}</p>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs capitalize">
                          {animal.active_status}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {animal.endangerment_status?.replace("_", " ")}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No animals in this habitat</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal preview (auto-updates when boxes change) */}
      <Modal
        open={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title="Report Preview"
        description="Merged report (Attractions + Habitats + Animals)"
        size="xl"
      >
        {selectedHeaders.length === 0 ? (
          <p className="text-gray-600">
            Select at least one column in Report Options to see the preview.
          </p>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {selectedHeaders.map((h) => (
                    <TableHead key={h}>{h.replace(/([A-Z])/g, " $1")}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportRows.map((row, idx) => (
                  <TableRow key={idx}>
                    {selectedHeaders.map((h) => (
                      <TableCell key={h}>{String(row[h] ?? "")}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {reportRows.length === 0 && (
              <div className="text-center py-8 text-gray-600">No rows available.</div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
