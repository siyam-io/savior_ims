'use client';

import { useCouriers, useUpdateCourier } from '@/hooks/useCouriers';
import { useRouter, useParams } from 'next/navigation';
import { CourierForm } from '@/components/features/couriers/CourierForm';
import { Truck, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function EditCourierPage() {
  const router = useRouter();
  const { id } = useParams();
  const { data: couriers, isLoading } = useCouriers();
  const { mutate: updateCourier, isPending } = useUpdateCourier();

  const courier = couriers?.find(c => c._id === id);

  const handleSubmit = (data: { name: string; charge: number }) => {
    updateCourier({ id: id as string, ...data }, {
      onSuccess: () => {
        router.push('/couriers');
      },
      onError: (err: any) => {
        alert(err.response?.data?.error || 'Failed to update courier');
      }
    });
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="font-black uppercase tracking-widest text-xs text-muted-foreground">Loading Partner Info...</p>
    </div>
  );

  if (!courier) return <div className="p-20 text-center font-black">Courier record not found.</div>;

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="gap-2 -ml-2 text-muted-foreground hover:text-foreground font-bold active:scale-95 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Services
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-xl shadow-primary/20">
          <Truck className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Edit Courier</h1>
          <p className="text-xs text-muted-foreground font-black uppercase tracking-[0.2em]">Update Logistics Info</p>
        </div>
      </div>

      <CourierForm 
        initialData={courier}
        onSubmit={handleSubmit} 
        isLoading={isPending} 
        onCancel={() => router.back()} 
      />
    </div>
  );
}
