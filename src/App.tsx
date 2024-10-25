import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Filters from './components/Filters';
import ProductComparison from './components/ProductComparison';
import ErrorBoundary from './components/ErrorBoundary';
import { fetchProducts } from './api';
import type { Product, SearchFilters, Retailer } from './types';

const mockRetailers: Retailer[] = [
  { id: 'amazon', name: 'Amazon', logo: 'amazon-logo.png' },
  { id: 'target', name: 'Target', logo: 'target-logo.png' },
  { id: 'walmart', name: 'Walmart', logo: 'walmart-logo.png' },
  { id: 'bestbuy', name: 'Best Buy', logo: 'bestbuy-logo.png' },
];

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({
    category: '',
    minPrice: 0,
    maxPrice: 0,
    retailers: [],
    rating: 0
  });

  useEffect(() => {
    let mounted = true;

    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProducts(filters);
        
        if (mounted) {
          setProducts(data);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load products');
          console.error('Error loading products:', err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      mounted = false;
    };
  }, [filters]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1">
              <Filters
                filters={filters}
                retailers={mockRetailers}
                onFilterChange={setFilters}
              />
            </aside>
            
            <div className="lg:col-span-3">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
                  <p className="font-medium">Error loading products</p>
                  <p className="text-sm mt-1">{error}</p>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="mt-2 text-sm bg-red-100 px-3 py-1 rounded hover:bg-red-200"
                  >
                    Retry
                  </button>
                </div>
              ) : products.length === 0 ? (
                <div className="bg-white p-8 rounded-lg text-center">
                  <p className="text-gray-500">No products found matching your criteria.</p>
                </div>
              ) : (
                <ProductComparison products={products} />
              )}
            </div>
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;