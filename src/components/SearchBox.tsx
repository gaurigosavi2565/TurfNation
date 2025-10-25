import React, { useState, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';

interface SearchBoxProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({ 
  onSearch, 
  placeholder = "Search by sport, city, or turf name...",
  className = ""
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, onSearch]);

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-slate-400" />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-500 focus:outline-none focus:placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900"
        placeholder={placeholder}
      />
      {query && (
        <button
          onClick={() => setQuery('')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <span className="text-slate-400 hover:text-slate-600">×</span>
        </button>
      )}
    </div>
  );
};

export default SearchBox;