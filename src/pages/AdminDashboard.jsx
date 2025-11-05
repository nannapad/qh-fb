import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { FiCheck, FiEye } from 'react-icons/fi';
import { Link, Navigate } from 'react-router-dom';

// Query function to fetch pending manuals
const fetchPendingManuals = async () => {
  const manualsQuery = query(
    collection(db, 'manuals'),
    where('status', '==', 'pending_approval')
  );
  const querySnapshot = await getDocs(manualsQuery);
  const manuals = [];
  querySnapshot.forEach((doc) => {
    manuals.push({ id: doc.id, ...doc.data() });
  });
  return manuals;
};

// Mutation for approving manual
const approveManual = httpsCallable(functions, 'approveManual');

const AdminDashboard = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const queryClient = useQueryClient();

  const { data: pendingManuals, isLoading, error } = useQuery({
    queryKey: ['manuals', 'pending'],
    queryFn: fetchPendingManuals,
    enabled: isAuthenticated && isAdmin,
  });

  const approveMutation = useMutation({
    mutationFn: (manualId) => approveManual({ manualId }),
    onSuccess: () => {
      // Invalidate and refetch pending manuals
      queryClient.invalidateQueries(['manuals', 'pending']);
      queryClient.invalidateQueries(['manuals', 'published']);
    },
    onError: (error) => {
      console.error('Failed to approve manual:', error);
      alert('Failed to approve manual. Please try again.');
    },
  });

  // Redirect if not admin or not authenticated
  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-400">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  const handleApprove = (manualId) => {
    if (window.confirm('Are you sure you want to approve this manual?')) {
      approveMutation.mutate(manualId);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">Loading pending manuals...</div>
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Review and approve pending manuals
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Pending Approvals ({pendingManuals?.length || 0})
          </h2>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {pendingManuals?.map((manual) => (
            <div key={manual.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    {manual.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Category: {manual.category || 'Uncategorized'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Submitted: {manual.createdAt?.toDate?.()?.toLocaleDateString() || 'Unknown date'}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>Likes: {manual.stats?.likes || 0}</span>
                    <span>Views: {manual.stats?.views || 0}</span>
                    <span>Downloads: {manual.stats?.downloads || 0}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 ml-4">
                  <Link
                    to={`/manual/${manual.id}`}
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <FiEye size={16} className="mr-1" />
                    Preview
                  </Link>
                  <button
                    onClick={() => handleApprove(manual.id)}
                    disabled={approveMutation.isPending}
                    className="flex items-center px-3 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiCheck size={16} className="mr-1" />
                    {approveMutation.isPending ? 'Approving...' : 'Approve'}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {pendingManuals?.length === 0 && (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              No pending manuals to review.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
