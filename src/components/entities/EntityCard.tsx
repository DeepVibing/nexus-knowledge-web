import { User, Building, Folder, Wrench, Lightbulb, Calendar, MapPin, FileText, BookOpen } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Card } from '../common/Card';
import type { EntityDto, EntityType } from '../../types';

interface EntityCardProps {
  entity: EntityDto;
  onClick?: () => void;
}

const typeIcons: Record<EntityType, typeof User> = {
  person: User,
  company: Building,
  project: Folder,
  tool: Wrench,
  concept: Lightbulb,
  event: Calendar,
  location: MapPin,
  document: FileText,
  term: BookOpen,
};

const typeColors: Record<EntityType, string> = {
  person: 'bg-blue-600',
  company: 'bg-purple-600',
  project: 'bg-green-600',
  tool: 'bg-orange-600',
  concept: 'bg-pink-600',
  event: 'bg-yellow-600',
  location: 'bg-red-600',
  document: 'bg-slate-600',
  term: 'bg-indigo-600',
};

export function EntityCard({ entity, onClick }: EntityCardProps) {
  const Icon = typeIcons[entity.entityType] || Lightbulb;

  return (
    <Card hover onClick={onClick}>
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className={`w-10 h-10 rounded-lg ${typeColors[entity.entityType]} flex items-center justify-center flex-shrink-0`}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-white truncate">{entity.name}</h3>
            <Badge variant="default" size="sm">
              {entity.entityType}
            </Badge>
          </div>

          {entity.description && (
            <p className="text-sm text-slate-400 line-clamp-2 mb-2">
              {entity.description}
            </p>
          )}

          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>{entity.mentionsCount} mentions</span>
            <span>{entity.relationshipsCount} relationships</span>
          </div>

          {entity.aliases && entity.aliases.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {entity.aliases.slice(0, 3).map((alias) => (
                <span
                  key={alias}
                  className="px-2 py-0.5 text-xs bg-slate-700 text-slate-300 rounded"
                >
                  {alias}
                </span>
              ))}
              {entity.aliases.length > 3 && (
                <span className="text-xs text-slate-500">
                  +{entity.aliases.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
