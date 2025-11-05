import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { doc, getDoc, collection, query, orderBy, getDocs } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db } from '../firebase/config';
import { functions } from '../firebase/config'; // Assuming functions is exported
import { FiHeart, FiDownload, FiChevronDown } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

// Query function to fetch a single manual
const fetchManual = async (manualId) => {
  const manualDoc = await getDoc(doc(db, 'manuals', manualId));
  if (!manualDoc.exists()) {
    throw new Error('Manual not found');
  }
  const manualData = manualDoc.data();

  // Fetch author data
  const authorDoc = await getDoc(doc(db, 'users', manualData.authorId));
  const authorData = authorDoc.exists() ? authorDoc.data() : { displayName: 'Unknown', avatarUrl: '' };

  // Fetch versions
  const versionsQuery = query(
    collection(db, 'manuals', manualId, 'versions'),
    orderBy('versionNumber', 'desc')
  );
  const versionsSnapshot = await getDocs(versionsQuery);
  const versions = [];
  versionsSnapshot.forEach((doc) => {
    versions.push({ id: doc.id, ...doc.data() });
  });

  return {
    id: manualDoc.id,
    ...manualData,
    author: authorData.displayName,
    avatar: authorData.avatarUrl,
    versions: versions.map(v => `v${v.versionNumber}`),
  };
};

// Mutation for incrementing view count
const incrementViewCount = httpsCallable(functions, 'incrementViewCount');

const ManualPage = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [liked, setLiked] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState('v1.0');

  const { data: manual, isLoading, error } = useQuery({
    queryKey: ['manual', id],
    queryFn: () => fetchManual(id),
    enabled: !!id,
  });

  // Increment view count on load
  const viewMutation = useMutation({
    mutationFn: () => incrementViewCount({ manualId: id }),
    onSuccess: () => {
      console.log('View count incremented');
    },
    onError: (error) => {
      console.error('Failed to increment view count:', error);
    },
  });

  useEffect(() => {
    if (manual && !isLoading) {
      viewMutation.mutate();
    }
  }, [manual, isLoading]);

  const handleLike = () => {
    if (!isAuthenticated) return;
    setLiked(!liked);
    // TODO: Implement like functionality with backend
  };

  const handleDownload = () => {
    if (!isAuthenticated) return;
    // Mock download - in real app, generate PDF or provide download link
    const element = document.createElement('a');
    const file = new Blob([manual.content], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    element.download = `${manual.title}.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">Loading manual...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center text-red-600">Error loading manual: {error.message}</div>
      </div>
    );
  }

  if (!manual) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">Manual not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Guest Warning */}
      {!isAuthenticated && (
        <div className="bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 dark:border-yellow-600 text-yellow-800 dark:text-yellow-200 px-4 py-3 rounded-md mb-6">
          <p className="text-sm">
            You are viewing this manual as a guest.{' '}
            <Link to="/login" className="underline hover:no-underline">
              Login
            </Link>{' '}
            to like and download manuals.
          </p>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {manual.title}
        </h1>

        {/* Author and Date */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <img
              src={manual.avatar || 'https://via.placeholder.com/40'}
              alt={manual.author}
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {manual.author}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {manual.createdAt?.toDate?.()?.toLocaleDateString() || 'Unknown date'}
              </p>
            </div>
          </div>

          {/* Version Selector */}
          {manual.versions && manual.versions.length > 0 && (
            <div className="relative">
              <select
                value={selectedVersion}
                onChange={(e) => setSelectedVersion(e.target.value)}
                className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {manual.versions.map((version) => (
                  <option key={version} value={version}>
                    {version}
                  </option>
                ))}
              </select>
              <FiChevronDown
                size={16}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 pointer-events-none"
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={handleLike}
            disabled={!isAuthenticated}
            className={`flex items-center px-4 py-2 rounded-md font-medium transition-colors ${
              liked
                ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            } ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <FiHeart size={18} className="mr-2" />
            Like
          </button>
          <button
            onClick={handleDownload}
            disabled={!isAuthenticated}
            className={`flex items-center px-4 py-2 rounded-md font-medium transition-colors bg-primary-600 hover:bg-primary-700 text-white ${
              !isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <FiDownload size={18} className="mr-2" />
            Download
          </button>
        </div>
      </div>

      {/* Content */}
      <div
        className="prose prose-lg dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: manual.content }}
      />
    </div>
  );
};

export default ManualPage;
