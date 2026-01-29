import React, { useState, useEffect, useCallback } from 'react';
import { waitlistAPI } from '../services/api';
import './Dashboard.css';

function Dashboard() {
  const [waitlist, setWaitlist] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [productFilter, setProductFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch waitlist data
  const fetchWaitlist = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const filters = {
        page: currentPage,
        limit: 10,
      };

      if (statusFilter) filters.status = statusFilter;
      if (productFilter) filters.productId = productFilter;

      const response = await waitlistAPI.getAll(filters);
      setWaitlist(response.data);
      setTotalPages(response.pagination.pages);
    } catch (err) {
      setError(err.error || 'Failed to fetch waitlist');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter, productFilter]);

  // Fetch statistics
  const fetchStats = useCallback(async () => {
    try {
      const response = await waitlistAPI.getStats();
      setStats(response.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, []);

  // Initial + filtered load
  useEffect(() => {
    fetchWaitlist();
    fetchStats();
  }, [fetchWaitlist, fetchStats]);

  // Handle status update
  const handleStatusChange = async (id, newStatus) => {
    try {
      await waitlistAPI.updateStatus(id, newStatus);
      setSuccess(`Status updated to ${newStatus}`);
      setTimeout(() => setSuccess(null), 3000);
      fetchWaitlist();
      fetchStats();
    } catch (err) {
      setError(err.error || 'Failed to update status');
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this entry?')) {
      try {
        await waitlistAPI.delete(id);
        setSuccess('Entry removed successfully');
        setTimeout(() => setSuccess(null), 3000);
        fetchWaitlist();
        fetchStats();
      } catch (err) {
        setError(err.error || 'Failed to delete entry');
      }
    }
  };

  return (
    <div className="dashboard-container">
      {/* UI unchanged */}
    </div>
  );
}

export default Dashboard;
