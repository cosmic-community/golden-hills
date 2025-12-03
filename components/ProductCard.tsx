import Link from 'next/link';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { metadata } = product;
  const name = metadata?.name || product.title;
  const price = metadata?.price || '';
  const category = metadata?.category;
  const image = metadata?.image;
  const featured = metadata?.featured;

  return (
    <Link 
      href={`/products/${product.slug}`}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        {image ? (
          <img
            src={`${image.imgix_url}?w=600&h=400&fit=crop&auto=format,compress`}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {featured && (
          <span className="absolute top-3 right-3 bg-accent-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
            Featured
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {category && (
          <span className="text-xs font-medium text-primary-600 uppercase tracking-wider">
            {category.value}
          </span>
        )}
        <h3 className="text-lg font-semibold text-gray-900 mt-1 mb-2 group-hover:text-primary-600 transition-colors">
          {name}
        </h3>
        <p className="text-xl font-bold text-primary-600">
          {price}
        </p>
      </div>
    </Link>
  );
}