import React, { useState, useEffect } from 'react';
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
  const fetchWaitlist = async () => {
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
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const response = await waitlistAPI.getStats();
      setStats(response.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  // Initial load
  useEffect(() => {
    fetchWaitlist();
    fetchStats();
  }, [statusFilter, productFilter, currentPage]);

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
      <header className="dashboard-header">
        <h1>Limited Edition Access</h1>
        <p>Admin Waitlist Dashboard</p>
      </header>

      {/* Statistics Section */}
      <section className="stats-section">
        <div className="stat-card">
          <div className="stat-value">{stats.total || 0}</div>
          <div className="stat-label">Total Waitlist</div>
        </div>
        <div className="stat-card approved">
          <div className="stat-value">{stats.byStatus?.Approved || 0}</div>
          <div className="stat-label">Approved</div>
        </div>
        <div className="stat-card pending">
          <div className="stat-value">{stats.byStatus?.Pending || 0}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card rejected">
          <div className="stat-value">{stats.byStatus?.Rejected || 0}</div>
          <div className="stat-label">Rejected</div>
        </div>
      </section>

      {/* Alerts */}
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Filters */}
      <section className="filters-section">
        <input
          type="text"
          placeholder="Filter by Product ID"
          value={productFilter}
          onChange={(e) => {
            setProductFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="filter-input"
        />
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="filter-select"
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
        <button onClick={() => { setStatusFilter(''); setProductFilter(''); }} className="btn-reset">
          Reset Filters
        </button>
      </section>

      {/* Waitlist Table */}
      <section className="table-section">
        {loading ? (
          <div className="loading">Loading waitlist...</div>
        ) : waitlist.length === 0 ? (
          <div className="empty-state">No entries found</div>
        ) : (
          <>
            <table className="waitlist-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Name</th>
                  <th>Product ID</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {waitlist.map((entry) => (
                  <tr key={entry._id} className={`status-${entry.status.toLowerCase()}`}>
                    <td className="email">{entry.email}</td>
                    <td>{entry.name}</td>
                    <td className="product-id">{entry.productId}</td>
                    <td>
                      <select
                        value={entry.status}
                        onChange={(e) => handleStatusChange(entry._id, e.target.value)}
                        className={`status-select ${entry.status.toLowerCase()}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="date">
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </td>
                    <td className="actions">
                      <button
                        onClick={() => handleDelete(entry._id)}
                        className="btn-delete"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="btn-pagination"
              >
                Previous
              </button>
              <span className="page-info">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="btn-pagination"
              >
                Next
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
