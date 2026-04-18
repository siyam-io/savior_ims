'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEmployee, useCreateEmployee, useUpdateEmployee } from '@/hooks/useEmployees';
import { useOutlets } from '@/hooks/useOutlets';
import { EmployeeForm } from '@/components/features/employees/EmployeeForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function AddEditEmployeePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [error, setError] = useState<string | null>(null);

  const { data: employee, isLoading: isFetching } = useEmployee(id || '');
  const { data: outlets } = useOutlets();
  const { mutate: createEmployee, isPending: isCreating } = useCreateEmployee();
  const { mutate: updateEmployee, isPending: isUpdating } = useUpdateEmployee();

  const handleSubmit = (data: any) => {
    setError(null);
    const handleError = (err: any) => {
      const resp = err.response?.data;
      if (resp?.errors && Array.isArray(resp.errors) && resp.errors.length > 0) {
        // Show the first validation error (e.g., "body.password: String must contain at least 6 character(s)")
        setError(`${resp.errors[0].path}: ${resp.errors[0].message}`);
      } else {
        setError(resp?.error || resp?.message || 'Something went wrong');
      }
    };

    if (id) {
      updateEmployee(
        { id, ...data },
        { 
          onSuccess: () => router.push('/employees'),
          onError: handleError
        }
      );
    } else {
      createEmployee(data, {
        onSuccess: () => router.push('/employees'),
        onError: handleError
      });
    }
  };

  if (id && isFetching) return <div className="p-8 text-center">Loading employee profile...</div>;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="gap-2 -ml-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Workforce
      </Button>

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-sm font-bold animate-in fade-in slide-in-from-top-2">
          {error}
        </div>
      )}

      <Card className="shadow-xl shadow-gray-100 dark:shadow-none border-muted">
        <CardHeader className="bg-muted/30 border-b">
          <CardTitle className="text-2xl font-bold">
            {id ? 'Modify Access & Permissions' : 'Staff Onboarding'}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-8">
          <EmployeeForm
            initialData={employee}
            outlets={outlets || []}
            onSubmit={handleSubmit}
            isLoading={isCreating || isUpdating}
            onCancel={() => router.back()}
          />
        </CardContent>
      </Card>
    </div>
  );
}
