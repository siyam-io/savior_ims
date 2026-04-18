'use client';

import { useOutlets, useDeleteOutlet } from '@/hooks/useOutlets';
import { OutletTable } from '@/components/features/outlets/OutletTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Outlet } from '@/types';

export default function OutletsPage() {
  const router = useRouter();
  const { data: outlets, isLoading } = useOutlets();
  const { mutate: deleteOutlet } = useDeleteOutlet();

  const handleEdit = (outlet: Outlet) => {
    router.push(`/outlets/add?id=${outlet._id}`);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this outlet?')) {
      deleteOutlet(id);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Outlets</h1>
          <p className="text-muted-foreground">Manage your physical store locations and regional points.</p>
        </div>
        
        <Button onClick={() => router.push('/outlets/add')} className="gap-2 w-full md:w-auto">
          <Plus className="h-4 w-4" />
          Add New Outlet
        </Button>
      </div>

      <div className="overflow-x-auto">
        <OutletTable
          outlets={outlets || []}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
