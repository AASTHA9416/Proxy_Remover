import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const userType = localStorage.getItem('userType');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/events', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch events');
      setLoading(false);
    }
  };

  const markAttendance = async (eventId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/events/${eventId}/attendance`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Attendance marked successfully!');
      fetchEvents(); // Refresh events list
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to mark attendance');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Events</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {event.title}
                </h2>
                <p className="text-gray-600 mb-4">{event.description}</p>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Date:</span>{' '}
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Time:</span>{' '}
                    {new Date(event.date).toLocaleTimeString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Location:</span> {event.location}
                  </p>
                </div>
                {userType === 'student' && !event.hasMarkedAttendance && (
                  <button
                    onClick={() => markAttendance(event._id)}
                    className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
                  >
                    Mark Attendance
                  </button>
                )}
                {event.hasMarkedAttendance && (
                  <div className="mt-4 text-green-600 font-medium text-center">
                    Attendance Marked ✓
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No events available at the moment.
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;