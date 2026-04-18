'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useProduct, useCreateProduct, useUpdateProduct } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useOutlets } from '@/hooks/useOutlets';
import { ProductForm } from '@/components/features/products/ProductForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CreateProductInput } from '@/types';

export default function AddEditProductPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const { data: product, isLoading: isFetching } = useProduct(id || '');
  const { data: categories } = useCategories();
  const { data: outlets } = useOutlets();
  const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();

  const handleSubmit = (data: CreateProductInput) => {
    if (id) {
      updateProduct(
        { id, ...data },
        { onSuccess: () => router.push('/products') }
      );
    } else {
      createProduct(data, {
        onSuccess: () => router.push('/products'),
      });
    }
  };

  if (id && isFetching) return <div className="p-8 text-center">Loading product specifications...</div>;

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="gap-2 -ml-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Inventory
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {id ? 'Modify Product Specifications' : 'Onboard New Product'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm
            initialData={product}
            categories={categories || []}
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
