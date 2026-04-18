'use client';

import { useEmployees, useDeleteEmployee } from '@/hooks/useEmployees';
import { EmployeeTable } from '@/components/features/employees/EmployeeTable';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Employee } from '@/hooks/useEmployees';

export default function EmployeesPage() {
  const router = useRouter();
  const { data: employees, isLoading } = useEmployees();
  const { mutate: deleteEmployee } = useDeleteEmployee();

  const handleEdit = (employee: Employee) => {
    router.push(`/employees/add?id=${employee._id}`);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this staff member? All their processed orders will remain in history.')) {
      deleteEmployee(id);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
          <p className="text-muted-foreground">Manage system access, roles, and outlet assignments for your workforce.</p>
        </div>
        
        <Button onClick={() => router.push('/employees/add')} className="gap-2 w-full md:w-auto shadow-lg shadow-primary/10">
          <UserPlus className="h-4 w-4" />
          Onboard New Staff
        </Button>
      </div>

      <div className="overflow-x-auto">
        <EmployeeTable
          employees={employees || []}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
