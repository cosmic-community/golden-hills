import { createBucketClient } from '@cosmicjs/sdk';
import type { Product, Page, SiteSettings, BlogPost, Author, BlogCategory, BlogTag } from '@/types';

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

// Search products by query
export async function searchProducts(query: string): Promise<Product[]> {
  try {
    const allProducts = await getProducts();
    const searchLower = query.toLowerCase().trim();
    
    return allProducts.filter(product => {
      const name = (product.metadata?.name || product.title || '').toLowerCase();
      const description = (product.metadata?.description || '').toLowerCase();
      const categoryValue = (product.metadata?.category?.value || '').toLowerCase();
      
      return name.includes(searchLower) || 
             description.includes(searchLower) ||
             categoryValue.includes(searchLower);
    });
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to search products');
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

// Blog functions

// Fetch all blog posts with pagination
export async function getBlogPosts(limit: number = 9, skip: number = 0): Promise<{ posts: BlogPost[]; total: number }> {
  try {
    const response = await cosmic.objects
      .find({ type: 'blog-posts' })
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(1);
    
    const allPosts = response.objects as BlogPost[];
    
    // Sort by published_date descending
    const sortedPosts = allPosts.sort((a, b) => {
      const dateA = new Date(a.metadata?.published_date || '').getTime();
      const dateB = new Date(b.metadata?.published_date || '').getTime();
      return dateB - dateA;
    });
    
    const paginatedPosts = sortedPosts.slice(skip, skip + limit);
    
    return {
      posts: paginatedPosts,
      total: sortedPosts.length
    };
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return { posts: [], total: 0 };
    }
    // Return empty array instead of throwing to prevent build failures
    console.warn('Failed to fetch blog posts:', error);
    return { posts: [], total: 0 };
  }
}

// Fetch featured blog posts
export async function getFeaturedBlogPosts(limit: number = 3): Promise<BlogPost[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'blog-posts', 'metadata.featured': true })
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(1);
    
    const posts = response.objects as BlogPost[];
    
    // Sort by published_date descending
    const sortedPosts = posts.sort((a, b) => {
      const dateA = new Date(a.metadata?.published_date || '').getTime();
      const dateB = new Date(b.metadata?.published_date || '').getTime();
      return dateB - dateA;
    });
    
    return sortedPosts.slice(0, limit);
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    // Return empty array instead of throwing to prevent build failures
    console.warn('Failed to fetch featured blog posts:', error);
    return [];
  }
}

// Fetch single blog post by slug
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'blog-posts', slug })
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(1);
    
    return response.object as BlogPost;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch blog post');
  }
}

// Fetch blog posts by category
export async function getBlogPostsByCategory(categorySlug: string, limit: number = 9): Promise<BlogPost[]> {
  try {
    const allResponse = await cosmic.objects
      .find({ type: 'blog-posts' })
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(1);
    
    const allPosts = allResponse.objects as BlogPost[];
    
    // Filter posts by category
    const filteredPosts = allPosts.filter(post => {
      const categories = post.metadata?.categories;
      if (!categories || !Array.isArray(categories)) return false;
      return categories.some(cat => cat.slug === categorySlug);
    });
    
    // Sort by published_date descending
    const sortedPosts = filteredPosts.sort((a, b) => {
      const dateA = new Date(a.metadata?.published_date || '').getTime();
      const dateB = new Date(b.metadata?.published_date || '').getTime();
      return dateB - dateA;
    });
    
    return sortedPosts.slice(0, limit);
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch blog posts by category');
  }
}

// Fetch blog posts by tag
export async function getBlogPostsByTag(tagSlug: string, limit: number = 9): Promise<BlogPost[]> {
  try {
    const allResponse = await cosmic.objects
      .find({ type: 'blog-posts' })
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(1);
    
    const allPosts = allResponse.objects as BlogPost[];
    
    // Filter posts by tag
    const filteredPosts = allPosts.filter(post => {
      const tags = post.metadata?.tags;
      if (!tags || !Array.isArray(tags)) return false;
      return tags.some(tag => tag.slug === tagSlug);
    });
    
    // Sort by published_date descending
    const sortedPosts = filteredPosts.sort((a, b) => {
      const dateA = new Date(a.metadata?.published_date || '').getTime();
      const dateB = new Date(b.metadata?.published_date || '').getTime();
      return dateB - dateA;
    });
    
    return sortedPosts.slice(0, limit);
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch blog posts by tag');
  }
}

// Fetch related blog posts (by shared categories/tags)
export async function getRelatedBlogPosts(currentPostId: string, limit: number = 3): Promise<BlogPost[]> {
  try {
    const currentPost = await cosmic.objects
      .findOne({ type: 'blog-posts', id: currentPostId })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    if (!currentPost.object) return [];
    
    const post = currentPost.object as BlogPost;
    const currentCategories = post.metadata?.categories?.map(c => c.id) || [];
    const currentTags = post.metadata?.tags?.map(t => t.id) || [];
    
    const allResponse = await cosmic.objects
      .find({ type: 'blog-posts' })
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(1);
    
    const allPosts = allResponse.objects as BlogPost[];
    
    // Filter out current post and score by relevance
    const scoredPosts = allPosts
      .filter(p => p.id !== currentPostId)
      .map(p => {
        let score = 0;
        const postCategories = p.metadata?.categories?.map(c => c.id) || [];
        const postTags = p.metadata?.tags?.map(t => t.id) || [];
        
        // Add points for shared categories
        postCategories.forEach(catId => {
          if (currentCategories.includes(catId)) score += 3;
        });
        
        // Add points for shared tags
        postTags.forEach(tagId => {
          if (currentTags.includes(tagId)) score += 1;
        });
        
        return { post: p, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score);
    
    return scoredPosts.slice(0, limit).map(item => item.post);
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch related blog posts');
  }
}

// Fetch all blog categories
export async function getBlogCategories(): Promise<BlogCategory[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'blog-categories' })
      .props(['id', 'title', 'slug', 'metadata']);
    
    return response.objects as BlogCategory[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch blog categories');
  }
}

// Fetch single blog category
export async function getBlogCategoryBySlug(slug: string): Promise<BlogCategory | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'blog-categories', slug })
      .props(['id', 'title', 'slug', 'metadata']);
    
    return response.object as BlogCategory;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch blog category');
  }
}

// Fetch all blog tags
export async function getBlogTags(): Promise<BlogTag[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'blog-tags' })
      .props(['id', 'title', 'slug', 'metadata']);
    
    return response.objects as BlogTag[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch blog tags');
  }
}

// Fetch single blog tag
export async function getBlogTagBySlug(slug: string): Promise<BlogTag | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'blog-tags', slug })
      .props(['id', 'title', 'slug', 'metadata']);
    
    return response.object as BlogTag;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch blog tag');
  }
}

// Fetch author by slug
export async function getAuthorBySlug(slug: string): Promise<Author | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'authors', slug })
      .props(['id', 'title', 'slug', 'metadata']);
    
    return response.object as Author;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch author');
  }
}

// Fetch blog posts by author
export async function getBlogPostsByAuthor(authorSlug: string, limit: number = 9): Promise<BlogPost[]> {
  try {
    const allResponse = await cosmic.objects
      .find({ type: 'blog-posts' })
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(1);
    
    const allPosts = allResponse.objects as BlogPost[];
    
    // Filter posts by author
    const filteredPosts = allPosts.filter(post => {
      const author = post.metadata?.author;
      return author && author.slug === authorSlug;
    });
    
    // Sort by published_date descending
    const sortedPosts = filteredPosts.sort((a, b) => {
      const dateA = new Date(a.metadata?.published_date || '').getTime();
      const dateB = new Date(b.metadata?.published_date || '').getTime();
      return dateB - dateA;
    });
    
    return sortedPosts.slice(0, limit);
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch blog posts by author');
  }
}