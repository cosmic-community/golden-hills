// app/products/[slug]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProducts, getProductBySlug } from '@/lib/cosmic';
import ReactMarkdown from 'react-markdown';
import type { Metadata } from 'next';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  
  if (!product) {
    return { title: 'Product Not Found' };
  }
  
  return {
    title: product.metadata?.name || product.title,
    description: product.metadata?.description?.slice(0, 160),
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  
  if (!product) {
    notFound();
  }

  const { metadata } = product;
  const name = metadata?.name || product.title;
  const description = metadata?.description || '';
  const price = metadata?.price || '';
  const category = metadata?.category;
  const image = metadata?.image;

  return (
    <div className="min-h-screen bg-earth-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-primary-600">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/products" className="text-gray-500 hover:text-primary-600">
              Products
            </Link>
            {category && (
              <>
                <span className="text-gray-400">/</span>
                <Link 
                  href={`/products?category=${category.key}`}
                  className="text-gray-500 hover:text-primary-600"
                >
                  {category.value}
                </Link>
              </>
            )}
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{name}</span>
          </nav>
        </div>
      </div>

      {/* Product Details */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Image */}
            <div className="relative">
              {image ? (
                <img
                  src={`${image.imgix_url}?w=800&h=800&fit=crop&auto=format,compress`}
                  alt={name}
                  className="w-full aspect-square object-cover rounded-2xl shadow-lg"
                />
              ) : (
                <div className="w-full aspect-square bg-gray-200 rounded-2xl flex items-center justify-center">
                  <svg className="w-24 h-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              {category && (
                <span className="absolute top-4 left-4 bg-primary-600 text-white text-sm font-medium px-3 py-1 rounded-full">
                  {category.value}
                </span>
              )}
            </div>

            {/* Info */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {name}
              </h1>
              
              <div className="text-3xl font-bold text-primary-600 mb-6">
                {price}
              </div>

              {description && (
                <div className="prose-content text-gray-700 mb-8">
                  <ReactMarkdown>{description}</ReactMarkdown>
                </div>
              )}

              <div className="bg-primary-50 rounded-xl p-6 mb-8">
                <h3 className="font-semibold text-primary-800 mb-2">
                  How to Order
                </h3>
                <p className="text-primary-700 text-sm">
                  Contact us directly to place an order. We deliver locally and 
                  are available at the Saturday farmers market.
                </p>
              </div>

              <Link 
                href="/products"
                className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Products
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}