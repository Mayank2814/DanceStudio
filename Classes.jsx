import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import API from '../api/axios';

const AttendanceMarker = ({ classId, classTitle, onClose }) => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTodayAttendance();
  }, [classId]);

  const fetchTodayAttendance = async () => {
    try {
      const { data } = await API.get(`/attendance/class/${classId}/today`);
      setAttendance(data.data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendance(attendance.map(record =>
      record.studentId === studentId ? { ...record, status } : record
    ));
  };

  const handleNotesChange = (studentId, notes) => {
    setAttendance(attendance.map(record =>
      record.studentId === studentId ? { ...record, notes } : record
    ));
  };

  const handleSaveAttendance = async (studentId, studentRecord) => {
    setSaving(true);
    try {
      await API.post('/attendance/mark', {
        classId,
        studentId,
        status: studentRecord.status,
        notes: studentRecord.notes
      });
      alert('Attendance saved successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      await Promise.all(
        attendance.map(record =>
          API.post('/attendance/mark', {
            classId,
            studentId: record.studentId,
            status: record.status,
            notes: record.notes
          })
        )
      );
      alert('All attendance records saved successfully');
    } catch (error) {
      alert('Failed to save some attendance records');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-accent-pink border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="glass-card w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Mark Attendance</h2>
            <p className="text-gray-400">{classTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Date Info */}
        <div className="mb-6 p-4 bg-primary/20 rounded-lg border border-accent-purple/30">
          <p className="text-gray-300">
            <span className="font-semibold">Date:</span> {new Date().toLocaleDateString()}
          </p>
          <p className="text-gray-300">
            <span className="font-semibold">Total Students:</span> {attendance.length}
          </p>
        </div>

        {/* Students Table */}
        {attendance.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 text-lg">No students enrolled in this class</p>
          </div>
        ) : (
          <div className="overflow-x-auto mb-6">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Student</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Notes</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {attendance.map((record) => (
                  <tr key={record.studentId} className="hover:bg-dark-lighter/50 transition-colors">
                    <td className="px-4 py-3 text-white">{record.name}</td>
                    <td className="px-4 py-3 text-gray-400 text-sm">{record.email}</td>
                    <td className="px-4 py-3">
                      <select
                        value={record.status}
                        onChange={(e) => handleAttendanceChange(record.studentId, e.target.value)}
                        className="px-3 py-1 rounded-lg bg-dark-lighter border border-accent-purple text-white text-sm cursor-pointer"
                      >
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                        <option value="excused">Excused</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        placeholder="Notes..."
                        value={record.notes}
                        onChange={(e) => handleNotesChange(record.studentId, e.target.value)}
                        className="px-3 py-1 rounded-lg bg-dark-lighter border border-accent-purple text-white text-sm w-full"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSaveAttendance(record.studentId, record)}
                        disabled={saving}
                        className="px-3 py-1 bg-accent-pink hover:bg-accent-pink/80 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                      >
                        Save
                      </motion.button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        <div className="flex gap-4 justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="px-6 py-2 bg-dark-lighter border border-gray-700 text-white rounded-lg font-medium"
          >
            Close
          </motion.button>
          {attendance.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSaveAll}
              disabled={saving}
              className="px-6 py-2 bg-accent-gold hover:bg-accent-gold/80 text-dark rounded-lg font-medium disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save All'}
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AttendanceMarker;
