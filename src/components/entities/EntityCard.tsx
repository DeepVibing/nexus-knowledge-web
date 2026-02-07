import { User, Building, Folder, Wrench, Lightbulb, Calendar, MapPin, FileText, BookOpen } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Card } from '../common/Card';
import type { EntityDto } from '../../types';

interface EntityCardProps {
  entity: EntityDto;
  onClick?: () => void;
}

const typeIcons: Record<string, typeof User> = {
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

const typeColors: Record<string, string> = {
  person: 'bg-blue-900 text-blue-400',
  company: 'bg-purple-900 text-purple-400',
  project: 'bg-emerald-900 text-emerald-400',
  tool: 'bg-orange-900 text-orange-400',
  concept: 'bg-[rgba(232,10,222,0.15)] text-[#E80ADE]',
  event: 'bg-amber-900 text-amber-400',
  location: 'bg-red-900 text-red-400',
  document: 'bg-[#1C1C1C] text-[#A0A0A0]',
  term: 'bg-cyan-900 text-cyan-400',
};

export function EntityCard({ entity, onClick }: EntityCardProps) {
  const Icon = typeIcons[entity.type] || Lightbulb;

  return (
    <Card hover onClick={onClick}>
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className={`w-10 h-10 rounded-sm ${typeColors[entity.type] || 'bg-[#1C1C1C] text-[#A0A0A0]'} flex items-center justify-center flex-shrink-0 border border-[#2A2A2A]`}
        >
          <Icon className="h-5 w-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-[#F5F5F5] text-sm truncate">{entity.name}</h3>
            <Badge variant="default" size="sm">
              {entity.type}
            </Badge>
          </div>

          {entity.description && (
            <p className="text-sm text-[#666666] line-clamp-2 mb-2">
              {entity.description}
            </p>
          )}

          {entity.aliases && entity.aliases.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {entity.aliases.slice(0, 3).map((alias) => (
                <span
                  key={alias}
                  className="px-2 py-0.5 text-xs bg-[#1C1C1C] text-[#A0A0A0] rounded-sm border border-[#2A2A2A]"
                >
                  {alias}
                </span>
              ))}
              {entity.aliases.length > 3 && (
                <span className="text-xs text-[#666666]">
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
