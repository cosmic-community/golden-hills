import { Suspense } from 'react';
import { getProducts } from '@/lib/cosmic';
import ProductGrid from '@/components/ProductGrid';
import CategoryFilter from '@/components/CategoryFilter';
import ProductSearch from '@/components/ProductSearch';
import { CATEGORIES } from '@/types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Products',
  description: 'Shop our selection of grass-fed beef, raw dairy, pasture-raised eggs, and farm goods.',
};

interface ProductsPageProps {
  searchParams: Promise<{ category?: string; search?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category, search } = await searchParams;
  const products = await getProducts();
  
  // Filter by category
  let filteredProducts = category
    ? products.filter(p => p.metadata?.category?.key === category)
    : products;
  
  // Filter by search query
  if (search) {
    const searchLower = search.toLowerCase().trim();
    filteredProducts = filteredProducts.filter(p => {
      const name = (p.metadata?.name || p.title || '').toLowerCase();
      const description = (p.metadata?.description || '').toLowerCase();
      const categoryValue = (p.metadata?.category?.value || '').toLowerCase();
      
      return name.includes(searchLower) || 
             description.includes(searchLower) ||
             categoryValue.includes(searchLower);
    });
  }

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

      {/* Search and Filters */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Search Bar */}
          <ProductSearch initialQuery={search || ''} />
          
          {/* Category Filters */}
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
          
          {/* Results Summary */}
          {(search || category) && (
            <div className="mb-6 text-center">
              <p className="text-gray-600">
                Found {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                {search && ` matching "${search}"`}
                {search && category && ' in '}
                {category && currentCategory && `${currentCategory.label}`}
              </p>
            </div>
          )}
          
          {/* Product Grid */}
          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductGrid products={filteredProducts} />
          </Suspense>
          
          {/* No Results Message */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <div className="mb-4">
                <svg className="w-16 h-16 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-6">
                {search 
                  ? `We couldn't find any products matching "${search}"${category ? ` in ${currentCategory?.label}` : ''}`
                  : 'No products found in this category.'}
              </p>
              {(search || category) && (
                <a
                  href="/products"
                  className="inline-block px-6 py-3 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors"
                >
                  View All Products
                </a>
              )}
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