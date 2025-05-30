// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import StudentAuth from './pages/StudentAuth';
import TeacherAuth from './pages/TeacherAuth';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import CreateEvent from './pages/CreateEvent';
import Events from './pages/Events';
import About from './pages/About';
import StudentLogin from './pages/StudentLogin';
import TeacherLogin from './pages/TeacherLogin';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Navbar />
      {/* <main className="min-h-screen bg-gray-50"> */}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          
          {/* Student Routes */}
          <Route path="/student/auth" element={<StudentAuth />} />
          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/events" element={<Events />} />

          {/* Teacher Routes */}
          <Route path="/teacher/auth" element={<TeacherAuth />} />
          <Route path="/teacher/login" element={<TeacherLogin />} />
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher/events/create" element={<CreateEvent />} />
          <Route path="/teacher/events" element={<Events />} />
        </Routes>
      {/* </main> */}
    </Router>
  );
}

export default App;