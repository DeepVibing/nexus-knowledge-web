import { useState } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import { EntityCard } from './EntityCard';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { PageLoader } from '../common/Spinner';
import { EmptyState } from '../common/EmptyState';
import type { EntityDto, EntityType } from '../../types';
import { cn } from '../../lib/utils';

interface EntityBrowserProps {
  entities: EntityDto[];
  isLoading?: boolean;
  onEntityClick?: (entity: EntityDto) => void;
  onCreateEntity?: () => void;
  onExtractEntities?: () => void;
}

const entityTypes: EntityType[] = [
  'person',
  'company',
  'project',
  'tool',
  'concept',
  'event',
  'location',
  'document',
  'term',
];

export function EntityBrowser({
  entities,
  isLoading,
  onEntityClick,
  onCreateEntity,
  onExtractEntities,
}: EntityBrowserProps) {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<EntityType | null>(null);

  const filteredEntities = entities.filter((entity) => {
    const matchesSearch =
      !search ||
      entity.name.toLowerCase().includes(search.toLowerCase()) ||
      entity.description?.toLowerCase().includes(search.toLowerCase());
    const matchesType = !selectedType || entity.entityType === selectedType;
    return matchesSearch && matchesType;
  });

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium tracking-wide text-[#F5F5F5]">Entities</h1>
        <div className="flex items-center gap-2">
          {onExtractEntities && (
            <Button variant="secondary" onClick={onExtractEntities}>
              Extract Entities
            </Button>
          )}
          {onCreateEntity && (
            <Button onClick={onCreateEntity} leftIcon={<Plus className="h-4 w-4" />}>
              Add Entity
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search entities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-[#666666]" />
          <div className="flex gap-1">
            <button
              onClick={() => setSelectedType(null)}
              className={cn(
                'px-3 py-1.5 text-sm rounded-sm transition-colors',
                !selectedType
                  ? 'bg-[#E80ADE] text-white'
                  : 'bg-[#1C1C1C] text-[#A0A0A0] hover:bg-[#2A2A2A] border border-[#2A2A2A]'
              )}
            >
              All
            </button>
            {entityTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={cn(
                  'px-3 py-1.5 text-sm rounded-sm transition-colors capitalize',
                  selectedType === type
                    ? 'bg-[#E80ADE] text-white'
                    : 'bg-[#1C1C1C] text-[#A0A0A0] hover:bg-[#2A2A2A] border border-[#2A2A2A]'
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      {filteredEntities.length === 0 ? (
        <EmptyState
          title="No entities found"
          description={
            search || selectedType
              ? 'Try adjusting your filters'
              : 'Extract entities from your sources or create them manually'
          }
          action={
            onExtractEntities && (
              <Button variant="secondary" onClick={onExtractEntities}>
                Extract Entities
              </Button>
            )
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEntities.map((entity) => (
            <EntityCard
              key={entity.id}
              entity={entity}
              onClick={() => onEntityClick?.(entity)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
