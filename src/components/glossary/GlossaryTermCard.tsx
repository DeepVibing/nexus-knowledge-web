import { Edit3, Trash2, Hash } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Card } from '../common/Card';
import type { GlossaryTermDto } from '../../types';
import { cn } from '../../lib/utils';

interface GlossaryTermCardProps {
  term: GlossaryTermDto;
  onEdit?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
}

export function GlossaryTermCard({ term, onEdit, onDelete, onClick }: GlossaryTermCardProps) {
  return (
    <Card hover onClick={onClick} className="group relative">
      <div className="flex items-start gap-4">
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-[#F5F5F5] text-sm">{term.term}</h3>
            {term.category && (
              <Badge variant="info" size="sm">
                {term.category}
              </Badge>
            )}
          </div>

          <p className="text-sm text-[#A0A0A0] mb-3 line-clamp-2">{term.definition}</p>

          {/* Aliases */}
          {term.aliases.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {term.aliases.map((alias) => (
                <span
                  key={alias}
                  className="inline-flex items-center px-1.5 py-0.5 text-xs text-[#666666] bg-[#1C1C1C] border border-[#2A2A2A] rounded-sm"
                >
                  {alias}
                </span>
              ))}
            </div>
          )}

          {/* Usage count */}
          <div className="flex items-center gap-1 text-xs text-[#666666]" style={{ fontFamily: 'var(--font-mono)' }}>
            <Hash className="h-3 w-3" />
            <span>{term.usageCount} uses</span>
          </div>
        </div>

        {/* Actions */}
        <div
          className={cn(
            'flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity',
            'absolute top-4 right-4'
          )}
        >
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-2 text-[#666666] hover:text-[#F5F5F5] hover:bg-[#2A2A2A] rounded-sm transition-colors"
              title="Edit"
            >
              <Edit3 className="h-4 w-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-2 text-[#666666] hover:text-red-400 hover:bg-[#2A2A2A] rounded-sm transition-colors"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}
