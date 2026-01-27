import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import { healthCheck } from './services/api';
import './App.css';

function App() {
  const [serverStatus, setServerStatus] = useState('checking');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if backend server is available
    const checkServer = async () => {
      try {
        await healthCheck();
        setServerStatus('online');
        setError(null);
      } catch (err) {
        setServerStatus('offline');
        setError('Backend server is not available. Make sure the server is running on http://localhost:5000');
      }
    };

    checkServer();
  }, []);

  return (
    <div className="App">
      {/* Server Status Indicator */}
      <div className={`server-status ${serverStatus}`}>
        <span className="status-dot"></span>
        <span className="status-text">
          Server: {serverStatus === 'online' ? 'Online' : serverStatus === 'offline' ? 'Offline' : 'Checking...'}
        </span>
      </div>

      {/* Error Alert if Server is Down */}
      {error && (
        <div className="error-banner">
          <div className="error-content">
            <strong>⚠️ Connection Error</strong>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Main Dashboard */}
      <Dashboard />
    </div>
  );
}

export default App;
