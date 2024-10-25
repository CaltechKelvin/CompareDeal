export interface Product {
  id: string;
  name: string;
  price: number;
  retailer: string;
  rating?: number;
  reviews?: number;
  image?: string;
  shipping?: number;
  tax?: number;
  url: string;
  category?: string;
  model_number?: string;
}

export interface Retailer {
  id: string;
  name: string;
  logo: string;
}

export interface SearchFilters {
  category: string;
  minPrice: number;
  maxPrice: number;
  retailers: string[];
  rating: number;
  search: string;
}