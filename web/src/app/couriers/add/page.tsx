'use client';

import { useCreateCourier } from '@/hooks/useCouriers';
import { useRouter } from 'next/navigation';
import { CourierForm } from '@/components/features/couriers/CourierForm';
import { Truck, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AddCourierPage() {
  const router = useRouter();
  const { mutate: createCourier, isPending } = useCreateCourier();

  const handleSubmit = (data: { name: string; charge: number }) => {
    createCourier(data, {
      onSuccess: () => {
        router.push('/couriers');
      },
      onError: (err: any) => {
        alert(err.response?.data?.error || 'Failed to create courier');
      }
    });
  };

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
          <h1 className="text-3xl font-black tracking-tight">New Courier</h1>
          <p className="text-xs text-muted-foreground font-black uppercase tracking-[0.2em]">Partner Onboarding</p>
        </div>
      </div>

      <CourierForm 
        onSubmit={handleSubmit} 
        isLoading={isPending} 
        onCancel={() => router.back()} 
      />
    </div>
  );
}
