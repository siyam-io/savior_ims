'use client';

import { useOutlets } from '@/hooks/useOutlets';
import { useCategories } from '@/hooks/useCategories';

interface FilterBarProps {
  selectedOutlet: string;
  setSelectedOutlet: (id: string) => void;
  selectedCategory: string;
  setSelectedCategory: (id: string) => void;
  selectedSubcategory: string;
  setSelectedSubcategory: (sub: string) => void;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
}

export default function FilterBar({
  selectedOutlet,
  setSelectedOutlet,
  selectedCategory,
  setSelectedCategory,
  selectedSubcategory,
  setSelectedSubcategory,
  selectedSize,
  setSelectedSize,
}: FilterBarProps) {
  const { data: outlets } = useOutlets();
  const { data: categories } = useCategories();

  const currentCategory = categories?.find(c => c._id === selectedCategory);

  return (
    <div className="flex flex-wrap gap-4 p-4 bg-white shadow rounded-lg">
      {/* Outlet filter */}
      <div className="flex flex-col">
        <span className="text-sm font-semibold mb-1">Outlet</span>
        <div className="flex gap-2">
          {outlets?.map((outlet) => (
            <button
              key={outlet._id}
              onClick={() => setSelectedOutlet(outlet._id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                selectedOutlet === outlet._id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {outlet.name}
            </button>
          ))}
        </div>
      </div>

      {/* Category filter */}
      <div className="flex flex-col">
        <span className="text-sm font-semibold mb-1">Category</span>
        <div className="flex gap-2">
          {categories?.map((cat) => (
            <button
              key={cat._id}
              onClick={() => {
                setSelectedCategory(cat._id);
                setSelectedSubcategory('');
                setSelectedSize('');
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                selectedCategory === cat._id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Subcategory filter (only if category selected) */}
      {currentCategory && (
        <div className="flex flex-col">
          <span className="text-sm font-semibold mb-1">Subcategory</span>
          <div className="flex gap-2">
            {currentCategory.subcategories.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubcategory(sub)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  selectedSubcategory === sub
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Size filter */}
      {currentCategory && (
        <div className="flex flex-col">
          <span className="text-sm font-semibold mb-1">Size</span>
          <div className="flex gap-2">
            {currentCategory.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  selectedSize === size
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
