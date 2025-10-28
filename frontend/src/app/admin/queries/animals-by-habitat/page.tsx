"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { queryService } from '@/services/query.service';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Leaf } from 'lucide-react';

export default function AnimalsByHabitatPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await queryService.getAnimalsByHabitat();
      setData(result);
    } catch (error) {
      console.error('Failed to load animals by habitat:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark_spring_green-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  // Group animals by habitat
  const habitatGroups = data.reduce((groups: any, item) => {
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
  }, {});

  const habitats = Object.values(habitatGroups);

  const getHealthBadge = (status: string) => {
    const variants: Record<string, any> = {
      excellent: 'success',
      good: 'secondary',
      fair: 'warning',
      poor: 'danger',
      critical: 'danger',
    };
    return variants[status] || 'default';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <MapPin className="h-8 w-8 text-sea_green-600" />
          Animals by Habitat
        </h1>
        <p className="text-gray-600 mt-1">View all animals grouped by their habitats</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {habitats.map((habitat: any) => (
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
                Environment: {habitat.environment_type || 'N/A'}
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
                          {animal.endangerment_status?.replace('_', ' ')}
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

      {habitats.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No habitats found</p>
        </div>
      )}
    </div>
  );
}
