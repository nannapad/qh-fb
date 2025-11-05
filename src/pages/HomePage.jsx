import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // For now, just log; later integrate search
    console.log('Search for:', searchQuery);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="text-center max-w-2xl">
        {/* Title with Gradient */}
        <h1 className="text-6xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-600 bg-clip-text text-transparent mb-6">
          Quick Help
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
          Discover step-by-step guides and manuals from our community. Find answers fast and share your knowledge.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative max-w-md mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search manuals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pr-12 text-lg border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              <FiSearch size={24} />
            </button>
          </div>
        </form>

        {/* Call to Action */}
        <div className="mt-8">
          <Link
            to="/feeds"
            className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-full text-lg font-medium transition-colors"
          >
            Explore Feeds
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;