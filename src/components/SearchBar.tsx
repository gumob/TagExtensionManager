import React, { FC, useState } from 'react';

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

const SearchBar: FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch?.(value);
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search extensions..."
        value={searchTerm}
        onChange={handleSearch}
        className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <span className="material-icons-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        search
      </span>
    </div>
  );
};

export { SearchBar }; 