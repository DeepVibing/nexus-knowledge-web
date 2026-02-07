import { FileText, Globe, MessageSquare, RefreshCw, Trash2, Clock, Loader2 } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Card } from '../common/Card';
import type { SourceDto, SourceStatus } from '../../types';
import { cn } from '../../lib/utils';

interface SourceCardProps {
  source: SourceDto;
  onSync?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
  isSyncing?: boolean;
  isDeleting?: boolean;
}

const statusVariants: Record<SourceStatus, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
  pending: 'warning',
  processing: 'info',
  analyzing: 'info',
  ready: 'success',
  failed: 'error',
  stale: 'warning',
};

const typeIcons: Record<string, typeof FileText> = {
  document: FileText,
  web_page: Globe,
  slack_channel: MessageSquare,
};

export function SourceCard({ source, onSync, onDelete, onClick, isSyncing, isDeleting }: SourceCardProps) {
  const Icon = typeIcons[source.sourceType] || FileText;

  return (
    <Card hover onClick={onClick} className="group relative">
      {/* Status top-border strip */}
      <div className={cn(
        'absolute top-0 left-0 right-0 h-[2px]',
        source.status === 'ready' && 'bg-emerald-500',
        source.status === 'processing' && 'bg-[#E80ADE]',
        source.status === 'pending' && 'bg-amber-500',
        source.status === 'failed' && 'bg-red-500',
        source.status === 'stale' && 'bg-amber-500',
      )} />

      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="w-10 h-10 rounded-sm bg-[#1C1C1C] border border-[#2A2A2A] flex items-center justify-center flex-shrink-0">
          <Icon className="h-5 w-5 text-[#666666]" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-[#F5F5F5] text-sm truncate">{source.name}</h3>
            <Badge variant={statusVariants[source.status]} size="sm">
              {source.status}
            </Badge>
          </div>

          <p className="text-sm text-[#666666] mb-2">{source.sourceType}</p>

          <div className="flex items-center gap-4 text-xs text-[#666666]" style={{ fontFamily: 'var(--font-mono)' }}>
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
              disabled={isSyncing}
              className={cn(
                'p-2 rounded-sm transition-colors',
                isSyncing
                  ? 'text-[#666666] opacity-50 cursor-not-allowed'
                  : 'text-[#666666] hover:text-[#F5F5F5] hover:bg-[#2A2A2A]'
              )}
              title="Sync"
            >
              {isSyncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              disabled={isDeleting}
              className={cn(
                'p-2 rounded-sm transition-colors',
                isDeleting
                  ? 'text-[#666666] opacity-50 cursor-not-allowed'
                  : 'text-[#666666] hover:text-red-400 hover:bg-[#2A2A2A]'
              )}
              title="Delete"
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}
