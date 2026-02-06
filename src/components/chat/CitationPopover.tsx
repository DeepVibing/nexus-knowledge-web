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
      <div className="fixed inset-0 bg-black/80" onClick={onClose} />

      {/* Popover */}
      <div className="relative w-full max-w-lg bg-[#1C1C1C] rounded-sm border border-[#2A2A2A] shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#2A2A2A]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm bg-[#2A2A2A] flex items-center justify-center">
              <FileText className="h-4 w-4 text-[#666666]" />
            </div>
            <div>
              <h3 className="font-medium text-[#F5F5F5] text-sm">{citation.sourceName}</h3>
              {citation.pageNumber && (
                <p className="text-xs text-[#666666]" style={{ fontFamily: 'var(--font-mono)' }}>Page {citation.pageNumber}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#666666] hover:text-[#F5F5F5] transition-colors"
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
              <span style={{ fontFamily: 'var(--font-mono)' }}>{Math.round(citation.relevanceScore * 100)}%</span> relevant
            </Badge>
          </div>

          <div className="bg-[#0A0A0A] rounded-sm p-4 border border-[#2A2A2A]">
            <p className="text-sm text-[#A0A0A0] whitespace-pre-wrap leading-relaxed">
              {citation.text}
            </p>
          </div>

          {citation.timestamp && (
            <p className="mt-3 text-xs text-[#666666]" style={{ fontFamily: 'var(--font-mono)' }}>
              Timestamp: {citation.timestamp.start}s - {citation.timestamp.end}s
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-[#2A2A2A]">
          <button className="flex items-center gap-2 text-sm text-[#E80ADE] hover:text-[#D000CC] transition-colors">
            <ExternalLink className="h-4 w-4" />
            View full source
          </button>
        </div>
      </div>
    </div>
  );
}
