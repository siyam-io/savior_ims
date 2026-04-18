'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useCategory, useCreateCategory, useUpdateCategory } from '@/hooks/useCategories';
import { CategoryForm } from '@/components/features/categories/CategoryForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AddEditCategoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const { data: category, isLoading: isFetching, isError } = useCategory(id || '');
  const { mutate: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();

  const handleSubmit = (data: { name: string; subcategories: string[]; sizes: string[] }) => {
    if (id) {
      updateCategory(
        { id, ...data },
        { onSuccess: () => router.push('/categories') }
      );
    } else {
      createCategory(data, {
        onSuccess: () => router.push('/categories'),
      });
    }
  };

  if (id && isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground font-medium">Fetching category blueprints...</p>
        </div>
      </div>
    );
  }

  if (id && isError) {
    return (
      <div className="p-8 max-w-md mx-auto text-center space-y-6">
        <div className="bg-destructive/10 p-6 rounded-3xl text-destructive space-y-2">
          <h3 className="font-black text-xl tracking-tight">Configuration Error</h3>
          <p className="text-sm font-medium opacity-80">The category you are trying to modify does not exist or has been removed.</p>
        </div>
        <Button onClick={() => router.push('/categories')} className="w-full h-12 rounded-xl font-bold">
          Return to Catalog
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="gap-2 -ml-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Categories
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {id ? 'Edit Category' : 'Add New Category'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryForm
            initialData={category}
            onSubmit={handleSubmit}
            isLoading={isCreating || isUpdating}
            onCancel={() => router.back()}
          />
        </CardContent>
      </Card>
    </div>
  );
}
