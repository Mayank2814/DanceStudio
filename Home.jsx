import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import API from '../api/axios';

const InstructorRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actioning, setActioning] = useState(null);
  const [error, setError] = useState('');

  const fetchRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await API.get('/admin/instructor-requests');
      setRequests(data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id) => {
    if (!window.confirm('Approve this instructor? This will grant them instructor access.')) return;
    setActioning(id + ':approve');
    try {
      await API.put(`/admin/instructor-requests/${id}/approve`);
      setRequests((prev) => prev.filter((r) => r._id !== id));
      alert('Instructor approved');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve');
    } finally {
      setActioning(null);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Reject this instructor request? This will revert their role to user.')) return;
    setActioning(id + ':reject');
    try {
      await API.put(`/admin/instructor-requests/${id}/reject`);
      setRequests((prev) => prev.filter((r) => r._id !== id));
      alert('Instructor request rejected');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject');
    } finally {
      setActioning(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[120px]">
        <div className="w-12 h-12 border-4 border-accent-pink border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-400 bg-red-900/10 p-4 rounded">{error}</div>
    );
  }

  if (!requests.length) {
    return (
      <div className="glass-card p-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-gray-400"
        >
          No pending instructor requests
        </motion.div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {requests.map((r) => (
        <motion.div
          key={r._id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -6, boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
          className="p-4 bg-gradient-to-r from-dark/60 to-dark-lighter rounded-lg flex items-center justify-between"
        >
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white font-bold">
                {r.name ? r.name.split(' ').map(n => n[0]).slice(0,2).join('') : r.email[0].toUpperCase()}
              </div>
              <div>
                <div className="text-white font-semibold">{r.name || '—'}</div>
                <div className="text-gray-400 text-sm">{r.email}</div>
                {r.createdAt && (
                  <div className="text-xs text-gray-500">Requested: {new Date(r.createdAt).toLocaleString()}</div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleReject(r._id)}
              disabled={!!actioning}
              className="px-3 py-1 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors text-sm"
            >
              {actioning === r._id + ':reject' ? 'Rejecting...' : 'Reject'}
            </button>
            <button
              onClick={() => handleApprove(r._id)}
              disabled={!!actioning}
              className="px-3 py-1 bg-accent-gold/10 text-accent-gold rounded-lg hover:bg-accent-gold/20 transition-colors text-sm"
            >
              {actioning === r._id + ':approve' ? 'Approving...' : 'Approve'}
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default InstructorRequests;
