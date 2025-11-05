import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import ManualCard from '../components/manual/ManualCard';

// Query function to fetch published manuals
const fetchPublishedManuals = async () => {
  const manualsQuery = query(
    collection(db, 'manuals'),
    where('status', '==', 'published')
  );
  const querySnapshot = await getDocs(manualsQuery);
  const manuals = [];
  querySnapshot.forEach((doc) => {
    manuals.push({ id: doc.id, ...doc.data() });
  });
  return manuals;
};

const FeedsPage = () => {
  const { isAuthenticated } = useAuth();

  const { data: manuals, isLoading, error } = useQuery({
    queryKey: ['manuals', 'published'],
    queryFn: fetchPublishedManuals,
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">Loading manuals...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center text-red-600">Error loading manuals: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Manual Feeds</h1>
        {isAuthenticated && (
          <Link
            to="/create-manual" // Placeholder route
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
          >
            Create New Manual
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {manuals?.map((manual) => (
          <ManualCard key={manual.id} manual={manual} />
        ))}
      </div>

      {manuals?.length === 0 && (
        <div className="text-center text-gray-600 dark:text-gray-400">
          No published manuals yet.
        </div>
      )}
    </div>
  );
};

export default FeedsPage;