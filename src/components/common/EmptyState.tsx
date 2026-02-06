import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4 text-center',
        className
      )}
    >
      {icon && (
        <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-sm bg-[#1C1C1C] text-[#666666] border border-[#2A2A2A]">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium tracking-wide text-[#F5F5F5] mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-[#666666] max-w-sm mb-4">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
