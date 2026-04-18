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
import { Category, Outlet, Product, CreateProductInput } from '@/types';
import { Plus, X, ImageIcon, Camera, Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import api from '@/lib/axios';

interface ProductFormProps {
  initialData?: Product | null;
  categories: Category[];
  outlets: Outlet[];
  onSubmit: (data: CreateProductInput) => void;
  isLoading: boolean;
  onCancel: () => void;
}

export function ProductForm({ initialData, categories, outlets, onSubmit, isLoading, onCancel }: ProductFormProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('0');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [activatedSizes, setActivatedSizes] = useState<string[]>([]);
  const [visuals, setVisuals] = useState<string[]>([]);
  const [stock, setStock] = useState<CreateProductInput['stock']>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  const selectedCategory = categories.find(c => c._id === categoryId);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setPrice(initialData.price.toString());
      setDescription(initialData.description || '');
      setCategoryId(initialData.categoryId?._id || '');
      setSubcategory(initialData.subcategory);
      setActivatedSizes(initialData.activatedSizes);
      setVisuals(initialData.visuals);
      setStock(initialData.stock);
    }
  }, [initialData]);

  // Sync stock with activated sizes
  useEffect(() => {
    const newStock = activatedSizes.map(size => {
      const existing = stock.find(s => s.size === size);
      return { size, quantity: existing ? existing.quantity : 0 };
    });
    
    if (JSON.stringify(newStock) !== JSON.stringify(stock)) {
      setStock(newStock);
    }
  }, [activatedSizes]);

  const toggleSize = (size: string) => {
    setActivatedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const updateStockQuantity = (size: string, quantity: number) => {
    setStock(prev => prev.map(s => s.size === size ? { ...s, quantity } : s));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const { data } = await api.post('/upload/image', formData);
      setVisuals(prev => [...prev, data.url]);
    } catch (err) {
      alert('Upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      price: parseFloat(price) || 0,
      description,
      categoryId,
      subcategory,
      activatedSizes,
      visuals,
      stock
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prod-name">Product Name</Label>
            <Input id="prod-name" value={name} onChange={e => setName(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prod-price">Unit Price (৳)</Label>
            <Input 
              id="prod-price" 
              type="number" 
              step="0.01" 
              value={price} 
              onChange={e => setPrice(e.target.value)} 
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prod-desc">Description (Optional)</Label>
            <Textarea 
              id="prod-desc" 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              rows={3}
              placeholder="Enter product details or notes..."
              className="resize-none rounded-2xl border-muted-foreground/20"
            />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select 
              value={categoryId} 
              onValueChange={(val) => {
                setCategoryId(val);
                setSubcategory('');
                setActivatedSizes([]);
              }}
              disabled={categories.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder={categories.length === 0 ? "Loading Categories..." : "Select Category"} />
              </SelectTrigger>
              <SelectContent>
                {categories.map(c => <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {selectedCategory && (
            <div className="space-y-2">
              <Label>Subcategory</Label>
              <Select value={subcategory} onValueChange={setSubcategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {selectedCategory.subcategories.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Visuals */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Product Visuals</Label>
            {uploadingImage && <div className="flex items-center gap-2 text-xs text-primary font-bold animate-pulse"><Loader2 className="w-3 h-3 animate-spin" /> Uploading...</div>}
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {visuals.map((url, i) => (
              <div key={i} className="relative aspect-square rounded-2xl border bg-muted/30 overflow-hidden group">
                <img src={url} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="" />
                <button 
                  type="button" 
                  onClick={() => setVisuals(visuals.filter((_, idx) => idx !== i))}
                  className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            <label className="relative aspect-square rounded-2xl border-2 border-dashed border-muted-foreground/20 flex flex-col items-center justify-center gap-2 hover:bg-muted/50 cursor-pointer transition-colors group">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Camera className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Add Photo</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
            </label>
          </div>
        </div>
      </div>

      {/* Sizes Selection */}
      {selectedCategory && (
        <div className="space-y-3">
          <Label>Activate Sizes</Label>
          <div className="flex flex-wrap gap-2">
            {selectedCategory.sizes.map(size => (
              <Button
                key={size}
                type="button"
                variant={activatedSizes.includes(size) ? 'default' : 'outline'}
                onClick={() => toggleSize(size)}
                className="rounded-full px-6"
              >
                {size}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Global Stock Management */}
      {activatedSizes.length > 0 && (
        <div className="space-y-4 p-6 bg-muted/20 rounded-3xl border border-muted-foreground/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Plus className="w-4 h-4" />
            </div>
            <Label className="text-sm font-black uppercase tracking-widest">Global Stock per Size</Label>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {stock.map(s => (
              <div key={s.size} className="space-y-2 group">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Size {s.size}</span>
                </div>
                <Input
                  type="number"
                  min="0"
                  className="h-10 rounded-xl bg-background border-muted-foreground/20 text-center font-bold focus:ring-primary"
                  value={s.quantity}
                  onChange={e => updateStockQuantity(s.size, parseInt(e.target.value) || 0)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-4 pt-6 border-t">
        <Button type="submit" size="lg" className="flex-1" disabled={isLoading}>
          {isLoading ? 'Saving Product...' : initialData ? 'Update Product Catalog' : 'Add Product to Catalog'}
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}
