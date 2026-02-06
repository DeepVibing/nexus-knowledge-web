import { X, FileText, ExternalLink } from 'lucide-react';
import type { Citation } from '../../types';
import { Badge } from '../common/Badge';

interface CitationPopoverProps {
  citation: Citation;
  onClose: () => void;
}

export function CitationPopover({ citation, onClose }: CitationPopoverProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />

      {/* Popover */}
      <div className="relative w-full max-w-lg bg-slate-800 rounded-xl border border-slate-700 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-slate-700 flex items-center justify-center">
              <FileText className="h-4 w-4 text-slate-400" />
            </div>
            <div>
              <h3 className="font-medium text-white">{citation.sourceName}</h3>
              {citation.pageNumber && (
                <p className="text-xs text-slate-400">Page {citation.pageNumber}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="info" size="sm">
              {citation.sourceType || 'document'}
            </Badge>
            <Badge variant="default" size="sm">
              {Math.round(citation.relevanceScore * 100)}% relevant
            </Badge>
          </div>

          <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
            <p className="text-sm text-slate-300 whitespace-pre-wrap">
              {citation.text}
            </p>
          </div>

          {citation.timestamp && (
            <p className="mt-3 text-xs text-slate-400">
              Timestamp: {citation.timestamp.start}s - {citation.timestamp.end}s
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-slate-700">
          <button className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
            <ExternalLink className="h-4 w-4" />
            View full source
          </button>
        </div>
      </div>
    </div>
  );
}
