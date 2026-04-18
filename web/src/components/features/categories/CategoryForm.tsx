'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Category } from '@/types';
import { X, Plus } from 'lucide-react';

interface CategoryFormProps {
  initialData?: Category | null;
  onSubmit: (data: { name: string; subcategories: string[]; sizes: string[] }) => void;
  isLoading: boolean;
  onCancel: () => void;
}

export function CategoryForm({ initialData, onSubmit, isLoading, onCancel }: CategoryFormProps) {
  const [name, setName] = useState('');
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [newSub, setNewSub] = useState('');
  const [newSize, setNewSize] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setSubcategories(initialData.subcategories);
      setSizes(initialData.sizes);
    } else {
      setName('');
      setSubcategories([]);
      setSizes([]);
    }
  }, [initialData]);

  const addSub = () => {
    const trimmed = newSub.trim();
    if (trimmed && !subcategories.some(s => s.toLowerCase() === trimmed.toLowerCase())) {
      setSubcategories([...subcategories, trimmed]);
      setNewSub('');
    }
  };

  const addSize = () => {
    const trimmed = newSize.trim();
    if (trimmed && !sizes.some(s => s.toLowerCase() === trimmed.toLowerCase())) {
      setSizes([...sizes, trimmed]);
      setNewSize('');
    }
  };

  const removeSub = (idx: number) => setSubcategories(subcategories.filter((_, i) => i !== idx));
  const removeSize = (idx: number) => setSizes(sizes.filter((_, i) => i !== idx));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, subcategories, sizes });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="cat-name">Category Name</Label>
        <Input
          id="cat-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Footwear, Apparel"
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-4">
        <Label>Subcategories</Label>
        <div className="flex gap-2">
          <Input
            value={newSub}
            onChange={(e) => setNewSub(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSub())}
            placeholder="Add subcategory..."
            disabled={isLoading}
          />
          <Button type="button" onClick={addSub} size="icon" variant="secondary" disabled={isLoading || !newSub.trim()}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {subcategories.map((sub, idx) => (
            <div key={idx} className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-medium">
              {sub}
              <button type="button" onClick={() => removeSub(idx)} className="hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label>Sizes</Label>
        <div className="flex gap-2">
          <Input
            value={newSize}
            onChange={(e) => setNewSize(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
            placeholder="Add size (e.g. XL, 42)..."
            disabled={isLoading}
          />
          <Button type="button" onClick={addSize} size="icon" variant="secondary" disabled={isLoading || !newSize.trim()}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size, idx) => (
            <div key={idx} className="flex items-center gap-1 border px-3 py-1 rounded-full text-sm font-medium">
              {size}
              <button type="button" onClick={() => removeSize(idx)} className="hover:text-destructive text-muted-foreground">
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 pt-4 border-t">
        <Button type="submit" className="flex-1" disabled={isLoading}>
          {isLoading ? 'Saving...' : initialData ? 'Update Category' : 'Create Category'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
