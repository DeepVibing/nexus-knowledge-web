import { Edit3, Trash2, Calendar, User } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Card } from '../common/Card';
import type { InsightDto, InsightType, InsightStatus } from '../../types';
import { cn } from '../../lib/utils';

interface InsightCardProps {
  insight: InsightDto;
  onEdit?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
}

const typeLabels: Record<InsightType, string> = {
  decision: 'Decision',
  action_item: 'Action Item',
  finding: 'Finding',
  question: 'Question',
};

const typeVariants: Record<InsightType, 'info' | 'warning' | 'success' | 'default'> = {
  decision: 'info',
  action_item: 'warning',
  finding: 'success',
  question: 'default',
};

const statusColors: Record<InsightStatus, string> = {
  open: 'border-l-amber-500',
  resolved: 'border-l-emerald-500',
  deferred: 'border-l-[#666666]',
};

export function InsightCard({ insight, onEdit, onDelete, onClick }: InsightCardProps) {
  return (
    <Card hover onClick={onClick} className={cn('group relative border-l-2', statusColors[insight.status])}>
      <div className="flex items-start gap-4">
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant={typeVariants[insight.type]} size="sm">
              {typeLabels[insight.type]}
            </Badge>
            <span className="text-xs text-[#666666] capitalize">{insight.status}</span>
          </div>

          <h3 className="font-medium text-[#F5F5F5] text-sm mb-1">{insight.title}</h3>
          <p className="text-sm text-[#A0A0A0] line-clamp-2 mb-3">{insight.content}</p>

          {/* Meta */}
          <div className="flex items-center gap-4 text-xs text-[#666666]">
            {insight.assignee && (
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {insight.assignee}
              </span>
            )}
            {insight.dueDate && (
              <span className="flex items-center gap-1" style={{ fontFamily: 'var(--font-mono)' }}>
                <Calendar className="h-3 w-3" />
                {new Date(insight.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>

          {/* Tags */}
          {insight.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {insight.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-1.5 py-0.5 text-xs text-[#666666] bg-[#1C1C1C] border border-[#2A2A2A] rounded-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
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
