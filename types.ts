// Base Cosmic object interface
export interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  metadata: Record<string, unknown>;
  type?: string;
  created_at?: string;
  modified_at?: string;
}

// Product category type
export type ProductCategory = 'beef' | 'dairy' | 'eggs' | 'pantry' | 'goods';

// Product category option from select-dropdown
export interface CategoryOption {
  key: ProductCategory;
  value: string;
}

// File/Image type from Cosmic
export interface CosmicFile {
  url: string;
  imgix_url: string;
}

// Product object
export interface Product extends CosmicObject {
  metadata: {
    name: string;
    description?: string;
    price: string;
    category: CategoryOption;
    featured?: boolean;
    image?: CosmicFile;
  };
}

// Page object
export interface Page extends CosmicObject {
  metadata: {
    title: string;
    hero_image?: CosmicFile;
    content?: string;
  };
}

// Site Settings object
export interface SiteSettings extends CosmicObject {
  metadata: {
    ranch_name: string;
    tagline?: string;
    logo?: CosmicFile;
    phone?: string;
    email?: string;
    address?: string;
    instagram_url?: string;
    facebook_url?: string;
  };
}

// Blog Author object
export interface Author extends CosmicObject {
  metadata: {
    name: string;
    bio?: string;
    photo?: CosmicFile;
    email?: string;
  };
}

// Blog Category object
export interface BlogCategory extends CosmicObject {
  metadata: {
    name: string;
    description?: string;
  };
}

// Blog Tag object
export interface BlogTag extends CosmicObject {
  metadata: {
    name: string;
  };
}

// Blog Post object
export interface BlogPost extends CosmicObject {
  metadata: {
    title: string;
    excerpt: string;
    content: string;
    featured_image: CosmicFile;
    author: Author;
    categories?: BlogCategory[];
    tags?: BlogTag[];
    published_date: string;
    featured?: boolean;
    meta_description?: string;
  };
}

// API response types
export interface CosmicResponse<T> {
  objects: T[];
  total: number;
  limit?: number;
  skip?: number;
}

export interface CosmicSingleResponse<T> {
  object: T;
}

// Category display info
export interface CategoryInfo {
  key: ProductCategory;
  label: string;
  description: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { key: 'beef', label: 'Grass-Fed Beef', description: '100% grass-fed and finished beef' },
  { key: 'dairy', label: 'Dairy', description: 'Raw milk and artisan cheeses' },
  { key: 'eggs', label: 'Eggs', description: 'Pasture-raised eggs' },
  { key: 'pantry', label: 'Pantry', description: 'Honey, preserves, and more' },
  { key: 'goods', label: 'Farm Goods', description: 'Handcrafted farm accessories' },
];