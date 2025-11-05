import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiEye, FiDownload } from 'react-icons/fi';

const ManualCard = ({ manual }) => {
  return (
    <Link
      to={`/manual/${manual.id}`}
      className="block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
    >
      {/* Thumbnail */}
      <img
        src={manual.thumbnail}
        alt={manual.title}
        className="w-full h-48 object-cover"
      />

      <div className="p-4">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
          {manual.title}
        </h3>

        {/* Author */}
        <div className="flex items-center mb-4">
          <img
            src={manual.avatar}
            alt={manual.author}
            className="w-8 h-8 rounded-full mr-3"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {manual.author}
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <FiHeart size={16} className="mr-1" />
              {manual.stats?.likes || 0}
            </div>
            <div className="flex items-center">
              <FiEye size={16} className="mr-1" />
              {manual.stats?.views || 0}
            </div>
            <div className="flex items-center">
              <FiDownload size={16} className="mr-1" />
              {manual.stats?.downloads || 0}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ManualCard;