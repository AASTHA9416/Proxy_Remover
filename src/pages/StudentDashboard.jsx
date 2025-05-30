import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { mockApi } from '../services/mockData';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEvents: 0,
    attendedEvents: 0,
    attendanceRate: 0,
  });
  const [availableEvents, setAvailableEvents] = useState([]);
  const [recentAttendance, setRecentAttendance] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Mock data for stats
        setStats({
          totalEvents: 3,
          attendedEvents: 1,
          attendanceRate: 33,
        });

        // Get events from mock API
        const events = await mockApi.getEvents();
        setAvailableEvents(events);

        // Mock recent attendance data
        setRecentAttendance([
          {
            id: '1',
            eventTitle: 'Data Science Seminar',
            markedAt: new Date('2024-03-22T14:00:00').toISOString(),
          }
        ]);
      } catch (error) {
        toast.error('Failed to load dashboard data');
        if (error.response?.status === 401) {
          navigate('/student/auth');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleMarkAttendance = async (eventId) => {
    try {
      await mockApi.markAttendance(eventId);
      toast.success('Attendance marked successfully!');

      // Refresh available events
      const events = await mockApi.getEvents();
      setAvailableEvents(events);

      // Update stats
      setStats(prev => ({
        ...prev,
        attendedEvents: prev.attendedEvents + 1,
        attendanceRate: Math.round(((prev.attendedEvents + 1) / prev.totalEvents) * 100)
      }));
    } catch (error) {
      toast.error(error.message || 'Failed to mark attendance');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Total Events</h2>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalEvents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Attended Events</h2>
              <p className="text-2xl font-semibold text-gray-900">{stats.attendedEvents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Attendance Rate</h2>
              <p className="text-2xl font-semibold text-gray-900">{stats.attendanceRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Available Events */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Available Events</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {availableEvents.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No events available at the moment
            </div>
          ) : (
            availableEvents.map((event) => (
              <div key={event._id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-gray-900">{event.title}</h4>
                    <p className="mt-1 text-sm text-gray-500">
                      {new Date(event.date).toLocaleString()}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Location: {event.location}
                    </p>
                  </div>
                  {!event.hasMarkedAttendance && (
                    <button
                      onClick={() => handleMarkAttendance(event._id)}
                      className="ml-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Mark Attendance
                    </button>
                  )}
                  {event.hasMarkedAttendance && (
                    <span className="ml-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Present
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recent Attendance */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Attendance</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {recentAttendance.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No attendance records yet
            </div>
          ) : (
            recentAttendance.map((record) => (
              <div key={record.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center">
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-gray-900">{record.eventTitle}</h4>
                    <p className="mt-1 text-sm text-gray-500">
                      Marked on: {new Date(record.markedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="ml-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Present
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;