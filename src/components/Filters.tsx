import React from 'react';
import type { SearchFilters, Retailer } from '../types';

interface FiltersProps {
  filters: SearchFilters;
  retailers: Retailer[];
  onFilterChange: (filters: SearchFilters) => void;
}

export default function Filters({ filters, retailers, onFilterChange }: FiltersProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="font-semibold text-lg mb-4">Filters</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select 
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={filters.category}
            onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
          >
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="home">Home & Garden</option>
            <option value="fashion">Fashion</option>
            <option value="toys">Toys</option>
            <option value="beauty">Beauty</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range
          </label>
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min"
              className="w-1/2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={filters.minPrice || ''}
              onChange={(e) => onFilterChange({ ...filters, minPrice: Number(e.target.value) })}
            />
            <input
              type="number"
              placeholder="Max"
              className="w-1/2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={filters.maxPrice || ''}
              onChange={(e) => onFilterChange({ ...filters, maxPrice: Number(e.target.value) })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Retailers
          </label>
          <div className="space-y-2">
            {retailers.map((retailer) => (
              <label key={retailer.id} className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={filters.retailers.includes(retailer.id)}
                  onChange={(e) => {
                    const newRetailers = e.target.checked
                      ? [...filters.retailers, retailer.id]
                      : filters.retailers.filter(id => id !== retailer.id);
                    onFilterChange({ ...filters, retailers: newRetailers });
                  }}
                />
                <span className="ml-2 text-sm text-gray-600">{retailer.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Rating
          </label>
          <input
            type="range"
            min="0"
            max="5"
            step="0.5"
            value={filters.rating}
            onChange={(e) => onFilterChange({ ...filters, rating: Number(e.target.value) })}
            className="w-full"
          />
          <div className="text-sm text-gray-600 text-center">{filters.rating} stars</div>
        </div>
      </div>
    </div>
  );
}