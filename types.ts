export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  hoverImage: string;
  description: string;
  sizes: string[];
  colors: string[];
  isNew?: boolean;
  colorImages?: Record<string, string>; // Map color name to image URL
  details?: {
    fabric: string;
    modelStats: string;
    stylingTips: string;
  };
  reviews?: Review[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  title: string;
  text: string;
  verified: boolean;
}

export interface JournalEntry {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  date: string;
  category: string;
}

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'newest';

export interface FilterState {
  category: string;
  minPrice: number;
  maxPrice: number;
  sort: SortOption;
}