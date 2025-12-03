import { Suspense } from 'react';
import { getProducts } from '@/lib/cosmic';
import ProductGrid from '@/components/ProductGrid';
import CategoryFilter from '@/components/CategoryFilter';
import { CATEGORIES } from '@/types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Products',
  description: 'Shop our selection of grass-fed beef, raw dairy, pasture-raised eggs, and farm goods.',
};

interface ProductsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category } = await searchParams;
  const products = await getProducts();
  
  const filteredProducts = category
    ? products.filter(p => p.metadata?.category?.key === category)
    : products;

  const currentCategory = category
    ? CATEGORIES.find(c => c.key === category)
    : null;

  return (
    <div className="min-h-screen bg-earth-50">
      {/* Hero */}
      <section className="bg-primary-800 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {currentCategory ? currentCategory.label : 'Our Products'}
          </h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            {currentCategory 
              ? currentCategory.description
              : 'Fresh from our pastures to your table. Every product raised with care and respect.'}
          </p>
        </div>
      </section>

      {/* Filters and Products */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <CategoryFilter 
            categories={CATEGORIES} 
            currentCategory={category || null}
            productCounts={products.reduce((acc, p) => {
              const key = p.metadata?.category?.key;
              if (key) {
                acc[key] = (acc[key] || 0) + 1;
              }
              return acc;
            }, {} as Record<string, number>)}
          />
          
          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductGrid products={filteredProducts} />
          </Suspense>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg text-gray-600">
                No products found in this category.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
          <div className="h-48 bg-gray-200" />
          <div className="p-6">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-3" />
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-full mb-4" />
            <div className="h-6 bg-gray-200 rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}