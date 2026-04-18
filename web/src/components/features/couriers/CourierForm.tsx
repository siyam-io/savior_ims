'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Truck, CircleDollarSign } from 'lucide-react';

interface CourierFormProps {
  initialData?: { name: string; charge: number } | null;
  onSubmit: (data: { name: string; charge: number }) => void;
  isLoading: boolean;
  onCancel: () => void;
}

export function CourierForm({ initialData, onSubmit, isLoading, onCancel }: CourierFormProps) {
  const [name, setName] = useState('');
  const [charge, setCharge] = useState('0');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setCharge(initialData.charge.toString());
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      charge: parseFloat(charge) || 0
    });
  };

  return (
    <Card className="border-muted shadow-2xl bg-card/50 backdrop-blur-sm overflow-hidden rounded-3xl">
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="courier-name" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                Courier Service Name
              </Label>
              <div className="relative">
                <Truck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="courier-name"
                  placeholder="e.g. RedX, Steadfast..."
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="pl-10 h-12 rounded-xl bg-background border-muted-foreground/20 focus:ring-primary"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="courier-charge" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                Standard Delivery Charge (৳)
              </Label>
              <div className="relative">
                <CircleDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="courier-charge"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={charge}
                  onChange={e => setCharge(e.target.value)}
                  className="pl-10 h-12 rounded-xl bg-background border-muted-foreground/20 focus:ring-primary"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t border-muted">
            <Button 
              type="submit" 
              className="flex-1 h-12 rounded-xl font-bold shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : initialData ? 'Update Courier Service' : 'Register Courier Partner'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="h-12 px-8 rounded-xl font-bold border-muted-foreground/20"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
