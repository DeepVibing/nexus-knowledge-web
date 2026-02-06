import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useToast } from '../../contexts/ToastContext';
import type { Toast as ToastType, ToastType as ToastVariant } from '../../contexts/ToastContext';

const icons: Record<ToastVariant, typeof CheckCircle> = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const variants: Record<ToastVariant, string> = {
  success: 'bg-[#141414] border-emerald-800 text-emerald-300',
  error: 'bg-[#141414] border-red-800 text-red-300',
  warning: 'bg-[#141414] border-amber-800 text-amber-300',
  info: 'bg-[#141414] border-[rgba(232,10,222,0.3)] text-[#E80ADE]',
};

function ToastItem({ toast, onRemove }: { toast: ToastType; onRemove: () => void }) {
  const Icon = icons[toast.type];

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-sm border shadow-lg',
        'animate-in slide-in-from-top-2 fade-in duration-200',
        variants[toast.type]
      )}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      <p className="text-sm font-medium flex-1">{toast.message}</p>
      <button
        onClick={onRemove}
        className="text-current opacity-70 hover:opacity-100 transition-opacity"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}
