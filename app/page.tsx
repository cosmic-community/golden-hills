import Link from 'next/link';
import { getSiteSettings, getFeaturedProducts, getProducts } from '@/lib/cosmic';
import ProductCard from '@/components/ProductCard';
import { CATEGORIES } from '@/types';

export default async function HomePage() {
  const [settings, featuredProducts, allProducts] = await Promise.all([
    getSiteSettings(),
    getFeaturedProducts(),
    getProducts(),
  ]);

  const ranchName = settings?.metadata?.ranch_name || 'Golden Hills Ranch';
  const tagline = settings?.metadata?.tagline || 'Sustainable Family Farming Since 1952';
  const heroImage = settings?.metadata?.logo?.imgix_url;

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: heroImage 
              ? `url(${heroImage}?w=1920&h=600&fit=crop&auto=format,compress)`
              : 'linear-gradient(135deg, #166534 0%, #14532d 100%)',
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">{ranchName}</h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">{tagline}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products" className="btn-primary bg-accent-500 hover:bg-accent-600">
              Shop Our Products
            </Link>
            <Link href="/about" className="inline-flex items-center justify-center px-6 py-3 text-white font-medium rounded-lg border-2 border-white hover:bg-white/10 transition-colors duration-200">
              Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our most popular items, fresh from the farm to your table
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/products" className="btn-primary">
                View All Products
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section className="py-16 px-4 bg-earth-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our selection of sustainably-raised products
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {CATEGORIES.map((category) => {
              const productCount = allProducts.filter(
                p => p.metadata?.category?.key === category.key
              ).length;
              
              return (
                <Link
                  key={category.key}
                  href={`/products?category=${category.key}`}
                  className="group bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                    <CategoryIcon category={category.key} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{category.label}</h3>
                  <p className="text-sm text-gray-500">{productCount} products</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Sustainable Family Farming
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                For three generations, Golden Hills Ranch has been committed to raising 
                animals the way nature intended. Our cattle roam freely on open pastures, 
                our chickens scratch in the sunshine, and our sheep graze on diverse 
                wildflower meadows.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                We practice regenerative agriculture that builds healthy soil, sequesters 
                carbon, and creates thriving ecosystems. No hormones, no antibiotics, 
                no shortcuts—just honest, nutritious food.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/farming-practices" className="btn-primary">
                  Our Practices
                </Link>
                <Link href="/about" className="btn-secondary">
                  Meet the Family
                </Link>
              </div>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
              <img
                src="https://imgix.cosmicjs.com/c5323790-cfdd-11f0-b693-79ceb5783a41-photo-1530836369250-ef72a3f5cda8-1764721184863.jpg?w=800&h=600&fit=crop&auto=format,compress"
                alt="Golden Hills Ranch pastoral landscape"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 px-4 bg-primary-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Visit the Ranch</h2>
          <p className="text-xl text-primary-100 mb-8">
            We love showing visitors around! Farm tours are available on weekends by appointment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {settings?.metadata?.phone && (
              <a 
                href={`tel:${settings.metadata.phone}`}
                className="btn-primary bg-accent-500 hover:bg-accent-600"
              >
                Call {settings.metadata.phone}
              </a>
            )}
            {settings?.metadata?.email && (
              <a 
                href={`mailto:${settings.metadata.email}`}
                className="btn-secondary border-white text-white hover:bg-white/10"
              >
                Email Us
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

// Category icons component
function CategoryIcon({ category }: { category: string }) {
  const iconClass = "w-8 h-8 text-primary-600";
  
  switch (category) {
    case 'beef':
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      );
    case 'dairy':
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      );
    case 'eggs':
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3c-4.97 0-9 5.373-9 12s4.03 9 9 9 9-2.373 9-9-4.03-12-9-12z" />
        </svg>
      );
    case 'pantry':
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      );
    case 'goods':
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      );
    default:
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      );
  }
}