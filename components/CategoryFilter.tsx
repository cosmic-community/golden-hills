'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import type { CategoryInfo } from '@/types';

interface CategoryFilterProps {
  categories: CategoryInfo[];
  currentCategory: string | null;
  productCounts: Record<string, number>;
}

export default function CategoryFilter({ 
  categories, 
  currentCategory,
  productCounts 
}: CategoryFilterProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Preserve search query when changing categories
  const search = searchParams.get('search');
  const buildUrl = (categoryKey?: string) => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (categoryKey) params.set('category', categoryKey);
    const queryString = params.toString();
    return `${pathname}${queryString ? `?${queryString}` : ''}`;
  };

  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          href={buildUrl()}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !currentCategory
              ? 'bg-primary-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          All Products
        </Link>
        {categories.map((category) => {
          const count = productCounts[category.key] || 0;
          const isActive = currentCategory === category.key;
          
          return (
            <Link
              key={category.key}
              href={buildUrl(category.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category.label} ({count})
            </Link>
          );
        })}
      </div>
    </div>
  );
}