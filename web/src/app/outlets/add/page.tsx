'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useOutlet, useCreateOutlet, useUpdateOutlet } from '@/hooks/useOutlets';
import { OutletForm } from '@/components/features/outlets/OutletForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AddEditOutletPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const { data: outlet, isLoading: isFetching } = useOutlet(id || '');
  const { mutate: createOutlet, isPending: isCreating } = useCreateOutlet();
  const { mutate: updateOutlet, isPending: isUpdating } = useUpdateOutlet();

  const handleSubmit = (data: { name: string; location: string }) => {
    if (id) {
      updateOutlet(
        { id, ...data },
        { onSuccess: () => router.push('/outlets') }
      );
    } else {
      createOutlet(data, {
        onSuccess: () => router.push('/outlets'),
      });
    }
  };

  if (id && isFetching) return <div className="p-8">Loading outlet data...</div>;

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-6">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="gap-2 -ml-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Outlets
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {id ? 'Edit Outlet' : 'Add New Outlet'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <OutletForm
            initialData={outlet}
            onSubmit={handleSubmit}
            isLoading={isCreating || isUpdating}
            onCancel={() => router.back()}
          />
        </CardContent>
      </Card>
    </div>
  );
}
