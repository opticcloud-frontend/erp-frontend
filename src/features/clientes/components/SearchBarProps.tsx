import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  type: string;
  error: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function SearchBar({ value, onChange, type = "Nome", error="" }: SearchBarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };


  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={"Buscar por " + type}
          className={`w-full px-4 py-3 pl-12 text-gray-700 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 
            ${
              error != "" ? 'border-red-500' : 'border-gray-300' 
            }
          `}
        />
        <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
        <p className='text-red-400 my-1'>{error}</p>
      </div>
    </form>
  );
}