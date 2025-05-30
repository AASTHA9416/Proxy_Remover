import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { mockApi } from '../services/mockData';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const userType = localStorage.getItem('userType');
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await mockApi.getEvents();
      // Sort events by date, most recent first
      const sortedEvents = response.sort((a, b) => new Date(b.date) - new Date(a.date));
      setEvents(sortedEvents);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch events');
      setLoading(false);
    }
  };

  const markAttendance = async (eventId) => {
    try {
      await mockApi.markAttendance(eventId);
      toast.success('Attendance marked successfully!');
      fetchEvents(); // Refresh events list
    } catch (error) {
      toast.error(error.message || 'Failed to mark attendance');
    }
  };

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
  };

  const handleCloseDetails = () => {
    setSelectedEvent(null);
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          {userType === 'teacher' && (
            <button
              onClick={() => navigate('/teacher/events/create')}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors duration-200"
            >
              Create New Event
            </button>
          )}
        </div>

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
                <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
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
                  {event.duration && (
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Duration:</span> {event.duration} minutes
                    </p>
                  )}
                </div>
                <div className="mt-4 space-y-2">
                  <button
                    onClick={() => handleViewDetails(event)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
                  >
                    View Details
                  </button>
                  {userType === 'student' && !event.hasMarkedAttendance && (
                    <button
                      onClick={() => markAttendance(event._id)}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-200"
                    >
                      Mark Attendance
                    </button>
                  )}
                  {event.hasMarkedAttendance && (
                    <div className="text-green-600 font-medium text-center">
                      Attendance Marked ✓
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No events available at the moment.
          </div>
        )}

        {/* Event Details Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedEvent.title}</h2>
                  <button
                    onClick={handleCloseDetails}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-600">{selectedEvent.description}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Date</p>
                      <p className="text-gray-900">{new Date(selectedEvent.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Time</p>
                      <p className="text-gray-900">{new Date(selectedEvent.date).toLocaleTimeString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Location</p>
                      <p className="text-gray-900">{selectedEvent.location}</p>
                    </div>
                    {selectedEvent.duration && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Duration</p>
                        <p className="text-gray-900">{selectedEvent.duration} minutes</p>
                      </div>
                    )}
                  </div>
                  {userType === 'teacher' && (
                    <div className="mt-4 flex space-x-4">
                      <button
                        onClick={() => {
                          handleCloseDetails();
                          navigate(`/teacher/events/${selectedEvent._id}`);
                        }}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
                      >
                        View Attendance
                      </button>
                      <button
                        onClick={() => {
                          handleCloseDetails();
                          navigate(`/teacher/events/${selectedEvent._id}/edit`);
                        }}
                        className="flex-1 bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 transition-colors duration-200"
                      >
                        Edit Event
                      </button>
                    </div>
                  )}
                  {userType === 'student' && !selectedEvent.hasMarkedAttendance && (
                    <button
                      onClick={() => {
                        markAttendance(selectedEvent._id);
                        handleCloseDetails();
                      }}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-200"
                    >
                      Mark Attendance
                    </button>
                  )}
                  {selectedEvent.hasMarkedAttendance && (
                    <div className="text-green-600 font-medium text-center">
                      Attendance Marked ✓
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;