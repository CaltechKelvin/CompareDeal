import type { SearchFilters, Product } from '../types';

const API_URL = 'http://localhost:3000/api';
const TIMEOUT = 10000; // 10 seconds timeout

async function fetchWithTimeout(url: string, options: RequestInit = {}) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

export async function fetchProducts(filters: SearchFilters): Promise<Product[]> {
  try {
    // Check server health first
    try {
      const healthCheck = await fetchWithTimeout(`${API_URL.replace('/api', '')}/health`);
      if (!healthCheck.ok) {
        throw new Error('Server is not responding');
      }
    } catch (error) {
      throw new Error('Server is not available. Please ensure the server is running.');
    }

    // Build query parameters
    const queryParams = new URLSearchParams();
    
    if (filters.category) queryParams.set('category', filters.category);
    if (filters.minPrice > 0) queryParams.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice > 0) queryParams.set('maxPrice', filters.maxPrice.toString());
    if (filters.retailers?.length) queryParams.set('retailers', filters.retailers.join(','));
    if (filters.rating > 0) queryParams.set('rating', filters.rating.toString());

    // Fetch products with timeout
    const response = await fetchWithTimeout(`${API_URL}/products?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch products');
    }

    const products = await response.json();
    return Array.isArray(products) ? products : [];
    
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching products:', error.message);
      throw new Error(`Failed to fetch products: ${error.message}`);
    }
    throw error;
  }
}