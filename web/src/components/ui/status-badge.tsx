'use client';
import { Badge } from '@/components/ui/badge';

const statusConfig = {
  pending: { label: 'Pending', className: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' },
  processing: { label: 'Processing', className: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
  shipped: { label: 'Shipped', className: 'bg-purple-500/10 text-purple-600 border-purple-500/20' },
  delivered: { label: 'Delivered', className: 'bg-green-500/10 text-green-600 border-green-500/20' },
  returned: { label: 'Returned', className: 'bg-red-500/10 text-red-600 border-red-500/20' },
  cancelled: { label: 'Cancelled', className: 'bg-gray-500/10 text-gray-600 border-gray-500/20' }
};

export function StatusBadge({ status }: { status: keyof typeof statusConfig }) {
  const config = statusConfig[status] || statusConfig.pending;
  return (
    <Badge variant="outline" className={`font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border shadow-sm ${config.className}`}>
      {config.label}
    </Badge>
  );
}
