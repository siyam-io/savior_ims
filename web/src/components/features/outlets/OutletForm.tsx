'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Outlet } from '@/types';

interface OutletFormProps {
  initialData?: Outlet | null;
  onSubmit: (data: { name: string }) => void;
  isLoading: boolean;
  onCancel: () => void;
}

export function OutletForm({ initialData, onSubmit, isLoading, onCancel }: OutletFormProps) {
  const [name, setName] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
    } else {
      setName('');
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Outlet Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Dhaka Main Branch"
          required
        />
      </div>
      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1" disabled={isLoading}>
          {isLoading ? 'Saving...' : initialData ? 'Update Outlet' : 'Create Outlet'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
