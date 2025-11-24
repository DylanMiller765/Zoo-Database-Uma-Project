"use client";

import { Modal } from './modal';
import { Button } from './button';
import { Badge } from './badge';
import { Card } from './card';

interface FieldConfig {
  label: string;
  key: string;
  format?: (value: any) => string;
  type?: 'text' | 'date' | 'datetime' | 'enum' | 'number' | 'currency';
}

interface FieldSection {
  title: string;
  fields: FieldConfig[];
}

interface EntityDetailModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  entity: any;
  sections: FieldSection[];
  onEdit?: () => void;
  canEdit?: boolean;
}

export function EntityDetailModal({
  open,
  onClose,
  title,
  entity,
  sections,
  onEdit,
  canEdit = true,
}: EntityDetailModalProps) {
  if (!entity) return null;

  const formatValue = (value: any, config: FieldConfig) => {
    if (value === null || value === undefined || value === '') {
      return <span className="text-gray-400 italic">Not set</span>;
    }

    if (config.format) {
      return config.format(value);
    }

    switch (config.type) {
      case 'date':
        return new Date(value).toLocaleDateString();
      case 'datetime':
        return new Date(value).toLocaleString();
      case 'currency':
        return `$${Number(value).toFixed(2)}`;
      case 'enum':
        return value.toString().replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
      case 'number':
        return Number(value).toLocaleString();
      default:
        return value.toString();
    }
  };

  const isDeleted = entity.deleted_at !== null && entity.deleted_at !== undefined;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={isDeleted ? 'This item has been deleted' : 'View details'}
      size="xl"
    >
      <div className="space-y-6">
        {isDeleted && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Badge variant="danger">Deleted</Badge>
              <span className="text-sm text-red-700">
                Deleted on {new Date(entity.deleted_at).toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* Display image if available and first section is Basic Information */}
        {entity.image_url && sections[0]?.title === 'Basic Information' && (
          <div className="mb-4">
            <img
              src={entity.image_url}
              alt={entity.habitat_name || entity.event_name || title}
              className="w-full max-w-md h-64 object-cover rounded-lg border border-gray-200 mx-auto"
            />
          </div>
        )}

        {sections.map((section, sectionIndex) => (
          <Card key={sectionIndex} className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
              {section.title}
            </h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              {section.fields.map((field, fieldIndex) => {
                const value = entity[field.key];
                return (
                  <div key={fieldIndex} className="flex flex-col">
                    <dt className="text-sm font-medium text-gray-500 mb-1">
                      {field.label}
                    </dt>
                    <dd className="text-sm text-gray-900">
                      {formatValue(value, field)}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </Card>
        ))}

        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {canEdit && onEdit && !isDeleted && (
            <Button onClick={onEdit}>
              Edit
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
