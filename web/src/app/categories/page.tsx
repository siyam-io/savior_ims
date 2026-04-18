'use client';

import { useCategories, useDeleteCategory } from '@/hooks/useCategories';
import { CategoryTable } from '@/components/features/categories/CategoryTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Category } from '@/types';

export default function CategoriesPage() {
  const router = useRouter();
  const { data: categories, isLoading } = useCategories();
  const { mutate: deleteCategory } = useDeleteCategory();

  const handleEdit = (category: Category) => {
    router.push(`/categories/add?id=${category._id}`);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this category? All products under this category may be affected.')) {
      deleteCategory(id);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">Define your product hierarchy with subcategories and size systems.</p>
        </div>
        
        <Button onClick={() => router.push('/categories/add')} className="gap-2 w-full md:w-auto">
          <Plus className="h-4 w-4" />
          Add New Category
        </Button>
      </div>

      <div className="overflow-x-auto">
        <CategoryTable
          categories={categories || []}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
