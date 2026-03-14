import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../api/axios';
import InstructorRequests from './InstructorRequests';
import AttendanceMarker from './AttendanceMarker';

const AdminDashboard = () => {
  const [classes, setClasses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor: '',
    style: '',
    level: '',
    schedule: '',
    duration: '',
    price: '',
    capacity: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const { data } = await API.get('/classes');
      // Normalize classes returned by backend to have consistent fields for the UI
      const normalized = data.data.map((c) => ({
        ...c,
        // Show danceStyle in UI while keeping backwards compatibility
        style: c.style || c.danceStyle,
        capacity: c.capacity || c.maxCapacity,
        // Display price in rupees for the UI
        displayPrice: c.price ? (c.price >= 100 ? Math.round(c.price / 100) : c.price) : 0,
      }));
      setClasses(normalized);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (!formData.title || !formData.description || !formData.instructor || !formData.level || !formData.schedule || !formData.duration || formData.price === '' || formData.capacity === '') {
      alert('Please fill all required fields.');
      return;
    }

    try {
      if (editingId) {
        // Normalize payload for update: convert field names and price to paise
        const payload = {
          ...formData,
          danceStyle: formData.style,
          maxCapacity: parseInt(formData.capacity, 10) || undefined,
          // Send price in rupees; backend converts to paise
          price: formData.price ? Number(formData.price) : undefined,
        };
        // Remove client-only helper fields
        delete payload.capacity;
        delete payload.style;

        // Debugging: show payload
        console.log('Updating class with payload:', payload);

        const res = await API.put(`/admin/classes/${editingId}`, payload);
        console.log('Update response:', res.data);
      } else {
        // For create, backend handles conversion from rupees to paise and accepts `style` or `danceStyle`
        const payload = {
          ...formData,
          style: formData.style,
          capacity: parseInt(formData.capacity, 10) || undefined,
          price: formData.price ? Number(formData.price) : undefined,
        };

        console.log('Creating class with payload:', payload);

        const res = await API.post('/admin/classes', payload);
        console.log('Create response:', res.data);
      }

      fetchClasses();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving class:', error.response?.data || error);
      const message =
        error.response?.data?.message ||
        (error.response?.data?.errors ? error.response.data.errors.map((e) => e.msg).join(', ') : null) ||
        error.message ||
        'Operation failed';
      alert(message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        await API.delete(`/admin/classes/${id}`);
        fetchClasses();
      } catch (error) {
        alert('Failed to delete class');
      }
    }
  };

  const handleEdit = (cls) => {
    setFormData({
      title: cls.title,
      description: cls.description,
      instructor: cls.instructor,
      style: cls.style || cls.danceStyle,
      level: cls.level,
      schedule: cls.schedule,
      duration: cls.duration,
      // Use normalized displayPrice if present (already rupees)
      price: cls.displayPrice ?? (cls.price ? Math.round(cls.price / 100) : ''),
      // Frontend uses `capacity` but backend may store `maxCapacity`
      capacity: cls.capacity ?? cls.maxCapacity ?? '',
    });
    setEditingId(cls._id);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      instructor: '',
      style: '',
      level: '',
      schedule: '',
      duration: '',
      price: '',
      capacity: '',
    });
    setEditingId(null);
  };

  // Calculate total revenue in rupees (use displayPrice if available, otherwise convert paise->rupees)
  const totalRevenue = classes.reduce((acc, cls) => {
    const priceRupees = cls.displayPrice ?? (cls.price ? Math.round(cls.price / 100) : 0);
    const students = cls.enrolledStudents?.length || 0;
    return acc + priceRupees * students;
  }, 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-accent-pink border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Classes</p>
              <h3 className="text-3xl font-bold text-white mt-1">{classes.length}</h3>
            </div>
            <div className="text-4xl">📚</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Students</p>
              <h3 className="text-3xl font-bold text-white mt-1">
                {classes.reduce((acc, cls) => acc + (cls.enrolledStudents?.length || 0), 0)}
              </h3>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Revenue</p>
              <h3 className="text-3xl font-bold text-white mt-1">₹{totalRevenue}</h3>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </motion.div>
      </div>

      {/* Instructor Requests (Pending) */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Instructor Requests</h2>
          <p className="text-sm text-gray-400">Review and approve new instructor accounts</p>
        </div>

        <div className="glass-card p-6 mb-6">
          <div className="mb-4">
            <motion.h3
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl font-semibold gradient-text"
            >
              Pending Approvals
            </motion.h3>
            <p className="text-sm text-gray-400">These users have requested instructor access and require verification.</p>
          </div>

          <InstructorRequests />
        </div>
      </div>

      {/* Classes Table */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Manage Classes</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="btn-primary"
          >
            + Add New Class
          </motion.button>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-lighter">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Class</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Instructor</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Style</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Students</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {classes.map((cls) => (
                  <tr key={cls._id} className="hover:bg-dark-lighter/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{cls.title}</div>
                      <div className="text-sm text-gray-400">
                        {typeof cls.schedule === 'object' && cls.schedule?.dayOfWeek
                          ? `${cls.schedule.dayOfWeek} ${cls.schedule.startTime}-${cls.schedule.endTime}`
                          : cls.schedule || 'TBA'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{cls.instructor}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-primary/20 text-accent-pink rounded-full text-sm">
                        {cls.danceStyle || cls.style || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {cls.enrolledStudents?.length || 0}/{cls.maxCapacity || cls.capacity || '—'}
                    </td>
                    <td className="px-6 py-4 text-gray-300">₹{cls.displayPrice ?? cls.price ?? 0}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 flex-wrap">
                        <Link to={`/class/${cls._id}/manage`}>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm"
                            title="View Class & Mark Attendance"
                          >
                            👁️ View
                          </motion.button>
                        </Link>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            setSelectedClass(cls);
                            setShowAttendanceModal(true);
                          }}
                          className="px-3 py-1 bg-accent-gold/20 text-accent-gold rounded-lg hover:bg-accent-gold/30 transition-colors text-sm"
                          title="Quick Mark Attendance"
                        >
                          ✓ Mark
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEdit(cls)}
                          className="px-3 py-1 bg-accent-purple/20 text-accent-purple rounded-lg hover:bg-accent-purple/30 transition-colors text-sm"
                        >
                          ✏️ Edit
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(cls._id)}
                          className="px-3 py-1 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
                        >
                          🗑️ Delete
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-2xl font-bold gradient-text mb-6">
              {editingId ? 'Edit Class' : 'Add New Class'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Instructor</label>
                  <input
                    type="text"
                    required
                    value={formData.instructor}
                    onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Style</label>
                  <select
                    required
                    value={formData.style}
                    onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Select Style</option>
                    <option value="Ballet">Ballet</option>
                    <option value="Hip Hop">Hip Hop</option>
                    <option value="Contemporary">Contemporary</option>
                    <option value="Salsa">Salsa</option>
                    <option value="Jazz">Jazz</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Level</label>
                  <select
                    required
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Select Level</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Schedule</label>
                  <input
                    type="text"
                    required
                    placeholder="Mon, Wed, Fri - 6:00 PM"
                    value={formData.schedule}
                    onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Duration (mins)</label>
                  <input
                    type="number"
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Capacity</label>
                  <input
                    type="number"
                    required
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  required
                  rows="4"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field resize-none"
                />
              </div>
              <div className="flex space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="btn-primary flex-1"
                >
                  {editingId ? 'Update Class' : 'Create Class'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-outline flex-1"
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Attendance Modal */}
      {showAttendanceModal && selectedClass && (
        <AttendanceMarker
          classId={selectedClass._id}
          classTitle={selectedClass.title}
          onClose={() => {
            setShowAttendanceModal(false);
            setSelectedClass(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
