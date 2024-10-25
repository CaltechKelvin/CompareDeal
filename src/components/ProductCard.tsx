import React from 'react';
import { ExternalLink, Star } from 'lucide-react';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const totalPrice = product.price + product.shipping + product.tax;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4">
      <div className="relative aspect-square mb-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain rounded-md"
        />
        <span className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-full text-sm">
          {product.retailer}
        </span>
      </div>
      
      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
      
      <div className="flex items-center mb-2">
        <Star className="h-4 w-4 text-yellow-400 fill-current" />
        <span className="ml-1 text-sm text-gray-600">
          {product.rating} ({product.reviews} reviews)
        </span>
      </div>

      <div className="space-y-1 mb-4">
        <p className="text-2xl font-bold text-blue-600">${totalPrice.toFixed(2)}</p>
        <p className="text-sm text-gray-500">
          + ${product.shipping.toFixed(2)} shipping
          + ${product.tax.toFixed(2)} tax
        </p>
      </div>

      <a
        href={product.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
      >
        View Deal <ExternalLink className="ml-2 h-4 w-4" />
      </a>
    </div>
  );
}