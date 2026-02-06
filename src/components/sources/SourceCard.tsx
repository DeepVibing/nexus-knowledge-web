import { FileText, Globe, MessageSquare, RefreshCw, Trash2, Clock } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Card } from '../common/Card';
import type { SourceDto, SourceStatus } from '../../types';
import { cn } from '../../lib/utils';

interface SourceCardProps {
  source: SourceDto;
  onSync?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
}

const statusVariants: Record<SourceStatus, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
  pending: 'warning',
  processing: 'info',
  ready: 'success',
  failed: 'error',
  stale: 'warning',
};

const typeIcons: Record<string, typeof FileText> = {
  document: FileText,
  web_page: Globe,
  slack_channel: MessageSquare,
};

export function SourceCard({ source, onSync, onDelete, onClick }: SourceCardProps) {
  const Icon = typeIcons[source.sourceType] || FileText;

  return (
    <Card hover onClick={onClick} className="group relative">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0">
          <Icon className="h-5 w-5 text-slate-400" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-white truncate">{source.name}</h3>
            <Badge variant={statusVariants[source.status]} size="sm">
              {source.status}
            </Badge>
          </div>

          <p className="text-sm text-slate-400 mb-2">{source.sourceType}</p>

          <div className="flex items-center gap-4 text-xs text-slate-500">
            {source.processing?.chunksCount && (
              <span>{source.processing.chunksCount} chunks</span>
            )}
            {source.processing?.tokensCount && (
              <span>{source.processing.tokensCount.toLocaleString()} tokens</span>
            )}
            {source.lastSyncedAt && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {new Date(source.lastSyncedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div
          className={cn(
            'flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity',
            'absolute top-4 right-4'
          )}
        >
          {onSync && source.origin.connector && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSync();
              }}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
              title="Sync"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
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
