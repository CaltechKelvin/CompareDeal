import React from 'react';
import { ExternalLink, ArrowDown, Star } from 'lucide-react';
import type { Product } from '../types';

interface ProductComparisonProps {
  products: Product[][];
}

export default function ProductComparison({ products }: ProductComparisonProps) {
  if (!products.length) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-500">Loading products or no matches found...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {products.map((group, groupIndex) => {
        // Sort by total price (including shipping and tax)
        const sortedItems = [...group].sort((a, b) => 
          (a.price + (a.shipping || 0) + (a.tax || 0)) - 
          (b.price + (b.shipping || 0) + (b.tax || 0))
        );
        
        const bestPrice = sortedItems[0];
        const savings = sortedItems.length > 1 
          ? (sortedItems[1].price + (sortedItems[1].shipping || 0) + (sortedItems[1].tax || 0)) - 
            (bestPrice.price + (bestPrice.shipping || 0) + (bestPrice.tax || 0))
          : 0;

        return (
          <div key={groupIndex} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-start gap-4">
              <img 
                src={bestPrice.image || 'https://via.placeholder.com/200'} 
                alt={bestPrice.name}
                className="w-32 h-32 object-contain rounded-md"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">{bestPrice.name}</h3>
                
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm text-gray-600">
                      {bestPrice.rating?.toFixed(1) || 'N/A'}
                    </span>
                  </div>
                  {bestPrice.reviews > 0 && (
                    <span className="text-sm text-gray-500">
                      ({bestPrice.reviews.toLocaleString()} reviews)
                    </span>
                  )}
                </div>
                
                {savings > 0 && (
                  <div className="mb-3 text-green-600 flex items-center gap-1">
                    <ArrowDown className="h-4 w-4" />
                    <span className="font-medium">Save ${savings.toFixed(2)} with best deal</span>
                  </div>
                )}

                <div className="space-y-2">
                  {sortedItems.map((item, index) => {
                    const total = item.price + (item.shipping || 0) + (item.tax || 0);
                    return (
                      <div 
                        key={item.id}
                        className={`flex items-center justify-between p-3 rounded ${
                          index === 0 ? 'bg-blue-50 border border-blue-100' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.retailer}</span>
                          {index === 0 && (
                            <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                              Best Price
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="font-semibold">${total.toFixed(2)}</div>
                            {(item.shipping > 0 || item.tax > 0) && (
                              <div className="text-xs text-gray-500">
                                {item.shipping > 0 && `+$${item.shipping.toFixed(2)} shipping`}
                                {item.tax > 0 && ` +$${item.tax.toFixed(2)} tax`}
                              </div>
                            )}
                          </div>
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn text-xs py-1"
                          >
                            View Deal
                            <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}