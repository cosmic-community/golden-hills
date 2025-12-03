import { createBucketClient } from '@cosmicjs/sdk';
import type { Product, Page, SiteSettings } from '@/types';

export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
  apiEnvironment: "staging"
});

// Helper to check if error has status property
function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}

// Fetch all products
export async function getProducts(): Promise<Product[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'products' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    return response.objects as Product[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch products');
  }
}

// Fetch featured products
export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'products', 'metadata.featured': true })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    return response.objects as Product[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch featured products');
  }
}

// Fetch products by category
export async function getProductsByCategory(categoryKey: string): Promise<Product[]> {
  try {
    const allProducts = await getProducts();
    return allProducts.filter(p => p.metadata?.category?.key === categoryKey);
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch products by category');
  }
}

// Fetch single product by slug
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'products', slug })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    return response.object as Product;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch product');
  }
}

// Fetch all pages
export async function getPages(): Promise<Page[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'pages' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    return response.objects as Page[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch pages');
  }
}

// Fetch single page by slug
export async function getPageBySlug(slug: string): Promise<Page | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'pages', slug })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    return response.object as Page;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch page');
  }
}

// Fetch site settings
export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'site-settings' })
      .props(['id', 'slug', 'metadata'])
      .depth(1);
    
    return response.object as SiteSettings;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch site settings');
  }
}