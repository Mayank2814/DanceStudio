import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../api/axios';

const UserDashboard = () => {
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnrolledClasses();
  }, []);

  const fetchEnrolledClasses = async () => {
    try {
      const { data } = await API.get('/classes/my-enrolled');
      setEnrolledClasses(data.data || []);
    } catch (error) {
      console.error('Error fetching enrolled classes:', error);
      if (error.response?.status === 401) {
        // Token is invalid or missing, clear localStorage
        localStorage.removeItem('token');
      }
      setEnrolledClasses([]);
    } finally {
      setLoading(false);
    }
  };

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
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Enrolled Classes</p>
              <h3 className="text-3xl font-bold text-white mt-1">{enrolledClasses.length}</h3>
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
              <p className="text-gray-400 text-sm">Hours Practiced</p>
              <h3 className="text-3xl font-bold text-white mt-1">{enrolledClasses.length * 10}</h3>
            </div>
            <div className="text-4xl">⏱️</div>
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
              <p className="text-gray-400 text-sm">Achievements</p>
              <h3 className="text-3xl font-bold text-white mt-1">{Math.floor(enrolledClasses.length / 2)}</h3>
            </div>
            <div className="text-4xl">🏆</div>
          </div>
        </motion.div>
      </div>

      {/* Enrolled Classes */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">My Classes</h2>
          <Link to="/classes">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-outline"
            >
              Browse More
            </motion.button>
          </Link>
        </div>

        {enrolledClasses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-12 text-center"
          >
            <div className="text-6xl mb-4">🎭</div>
            <h3 className="text-2xl font-bold text-white mb-2">No Classes Yet</h3>
            <p className="text-gray-400 mb-6">Start your dance journey by enrolling in a class</p>
            <Link to="/classes">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary"
              >
                Explore Classes
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledClasses.map((cls, index) => (
              <motion.div
                key={cls._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass-card p-6 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-accent-pink transition-colors">
                      {cls.title}
                    </h3>
                    <p className="text-gray-400 text-sm">{cls.style}</p>
                  </div>
                  <span className="text-2xl">{cls.style === 'Ballet' ? '🩰' : cls.style === 'Hip Hop' ? '🎤' : '💃'}</span>
                </div>

                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex items-center">
                    <span className="mr-2">👨‍🏫</span>
                    <span>{cls.instructor}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">📅</span>
                    <span>
                      {typeof cls.schedule === 'object' && cls.schedule?.dayOfWeek
                        ? `${cls.schedule.dayOfWeek} ${cls.schedule.startTime}-${cls.schedule.endTime}`
                        : cls.schedule || 'TBA'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">⏰</span>
                    <span>{cls.duration} minutes</span>
                  </div>
                </div>

                <Link to={`/classes/${cls._id}`}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full mt-4 btn-outline"
                  >
                    View Details
                  </motion.button>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
