import type { InsightStatsDto, InsightStatus } from '../../types';
import { cn } from '../../lib/utils';

interface InsightStatsBarProps {
  stats: InsightStatsDto;
  activeFilter?: InsightStatus;
  onFilterChange: (status: InsightStatus | undefined) => void;
}

export function InsightStatsBar({ stats, activeFilter, onFilterChange }: InsightStatsBarProps) {
  const items: { label: string; count: number; status: InsightStatus; color: string }[] = [
    { label: 'Open', count: stats.open, status: 'open', color: 'text-amber-400' },
    { label: 'Resolved', count: stats.resolved, status: 'resolved', color: 'text-emerald-400' },
    { label: 'Deferred', count: stats.deferred, status: 'deferred', color: 'text-[#666666]' },
  ];

  return (
    <div className="flex items-center gap-2">
      {items.map(({ label, count, status, color }) => (
        <button
          key={status}
          onClick={() => onFilterChange(activeFilter === status ? undefined : status)}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-sm transition-colors text-sm',
            activeFilter === status
              ? 'bg-[rgba(232,10,222,0.08)] border border-[rgba(232,10,222,0.2)] text-[#E80ADE]'
              : 'bg-[#1C1C1C] border border-[#2A2A2A] text-[#A0A0A0] hover:border-[#3A3A3A]'
          )}
        >
          <span>{label}</span>
          <span
            className={cn('font-semibold', activeFilter === status ? 'text-[#E80ADE]' : color)}
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {count}
          </span>
        </button>
      ))}
    </div>
  );
}
