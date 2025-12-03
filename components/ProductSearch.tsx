'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search, X } from 'lucide-react';

interface ProductSearchProps {
  initialQuery?: string;
}

export default function ProductSearch({ initialQuery = '' }: ProductSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);

  // Update local state when URL changes
  useEffect(() => {
    const urlQuery = searchParams.get('search') || '';
    if (urlQuery !== query) {
      setQuery(urlQuery);
    }
  }, [searchParams]);

  const handleSearch = (value: string) => {
    setQuery(value);
    
    // Build new search params
    const params = new URLSearchParams(searchParams.toString());
    
    if (value.trim()) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    
    // Preserve category filter if present
    const category = searchParams.get('category');
    if (category) {
      params.set('category', category);
    }
    
    // Update URL
    const queryString = params.toString();
    router.push(`${pathname}${queryString ? `?${queryString}` : ''}`);
  };

  const clearSearch = () => {
    setQuery('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('search');
    
    const queryString = params.toString();
    router.push(`${pathname}${queryString ? `?${queryString}` : ''}`);
  };

  return (
    <div className="relative max-w-2xl mx-auto mb-8">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search products by name or description..."
          className="w-full pl-12 pr-12 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Clear search"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      {query && (
        <p className="text-sm text-gray-600 mt-2 text-center">
          Searching for "{query}"
        </p>
      )}
    </div>
  );
}