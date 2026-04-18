'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Employee, CreateEmployeeInput } from '@/hooks/useEmployees';
import { Outlet } from '@/types';
import { X, Check } from 'lucide-react';

interface EmployeeFormProps {
  initialData?: Employee | null;
  outlets: Outlet[];
  onSubmit: (data: CreateEmployeeInput) => void;
  isLoading: boolean;
  onCancel: () => void;
}

export function EmployeeForm({ initialData, outlets, onSubmit, isLoading, onCancel }: EmployeeFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'employee'>('employee');
  useEffect(() => {
    if (initialData) {
      setEmail(initialData.email);
      setRole(initialData.role);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ email, password, role });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input 
            id="email" 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            placeholder="staff@savior.com"
            required 
          />
        </div>

        {!initialData && (
          <div className="space-y-2">
            <Label htmlFor="password">Initial Password</Label>
            <Input 
              id="password" 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="Min 6 characters"
              required 
            />
          </div>
        )}

        <div className="space-y-2">
          <Label>System Role</Label>
          <Select value={role} onValueChange={(val: any) => setRole(val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="employee">Staff Member</SelectItem>
              <SelectItem value="admin">Administrator</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
        <Button type="submit" size="lg" className="flex-1" disabled={isLoading}>
          {isLoading ? 'Saving Employee...' : initialData ? 'Update Employee Access' : 'Register New Employee'}
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={onCancel} className="sm:w-[120px]">Cancel</Button>
      </div>
    </form>
  );
}
