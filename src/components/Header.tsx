import React, { useState } from 'react';
import { Search, ShoppingCart, Menu, User } from 'lucide-react';

interface HeaderProps {
  onSearch: (term: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Menu className="h-6 w-6 mr-4 text-gray-500 lg:hidden" />
            <h1 className="text-2xl font-bold text-blue-600">CompareDeal</h1>
          </div>
          
          <form onSubmit={handleSubmit} className="flex-1 max-w-2xl mx-4">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products across all retailers..."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 p-1 hover:bg-gray-100 rounded-full"
              >
                <Search className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </form>

          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <ShoppingCart className="h-6 w-6 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <User className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}