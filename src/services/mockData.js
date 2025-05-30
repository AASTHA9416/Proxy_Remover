// Mock data for events
let mockEvents = [
    {
        _id: '1',
        title: 'Web Development Workshop',
        description: 'Learn the basics of web development with HTML, CSS, and JavaScript',
        date: new Date('2024-03-20T10:00:00').toISOString(),
        location: 'Room 101, Computer Science Building',
        hasMarkedAttendance: false
    },
    {
        _id: '2',
        title: 'Data Science Seminar',
        description: 'Introduction to machine learning and data analysis',
        date: new Date('2024-03-22T14:00:00').toISOString(),
        location: 'Auditorium A',
        hasMarkedAttendance: true
    },
    {
        _id: '3',
        title: 'Career Fair 2024',
        description: 'Meet with top companies and explore job opportunities',
        date: new Date('2024-03-25T09:00:00').toISOString(),
        location: 'Main Campus Hall',
        hasMarkedAttendance: false
    }
];

// Mock user data
const mockUsers = {
    student: {
        studentId: 'STU001',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        department: 'Computer Science',
        semester: 6
    },
    teacher: {
        teacherId: 'TCH001',
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '9876543210',
        department: 'Computer Science',
        designation: 'Associate Professor',
        subjects: ['Web Development', 'Data Structures', 'Algorithms'],
        experience: '10 years',
        qualification: 'Ph.D. in Computer Science'
    }
};

// Mock API functions
export const mockApi = {
    // Events API
    getEvents: () => {
        return Promise.resolve(mockEvents);
    },

    markAttendance: (eventId) => {
        const event = mockEvents.find(e => e._id === eventId);
        if (event) {
            event.hasMarkedAttendance = true;
        }
        return Promise.resolve({ success: true });
    },

    createEvent: (eventData) => {
        const newEvent = {
            _id: Date.now().toString(),
            ...eventData,
            hasMarkedAttendance: false
        };
        mockEvents.push(newEvent);
        return Promise.resolve({ success: true, event: newEvent });
    },

    // Auth API
    studentLogin: (data) => {
        if (data.studentId === mockUsers.student.studentId &&
            data.email === mockUsers.student.email) {
            return Promise.resolve({
                success: true,
                token: 'mock-student-token',
                user: mockUsers.student
            });
        }
        return Promise.reject(new Error('Invalid credentials'));
    },

    studentRegister: (data) => {
        return Promise.resolve({
            success: true,
            message: 'OTP sent successfully'
        });
    },

    verifyStudentLogin: (data) => {
        if (data.otp === '123456') {
            return Promise.resolve({
                success: true,
                token: 'mock-student-token',
                user: mockUsers.student
            });
        }
        return Promise.reject(new Error('Invalid OTP'));
    },

    verifyStudentRegister: (data) => {
        if (data.otp === '123456') {
            return Promise.resolve({
                success: true,
                token: 'mock-student-token',
                user: mockUsers.student
            });
        }
        return Promise.reject(new Error('Invalid OTP'));
    },

    // Teacher Auth API
    teacherLogin: (data) => {
        if (data.teacherId === mockUsers.teacher.teacherId &&
            data.email === mockUsers.teacher.email) {
            return Promise.resolve({
                success: true,
                token: 'mock-teacher-token',
                user: mockUsers.teacher
            });
        }
        return Promise.reject(new Error('Invalid credentials'));
    },

    teacherRegister: (data) => {
        return Promise.resolve({
            success: true,
            message: 'OTP sent successfully'
        });
    },

    verifyTeacherLogin: (data) => {
        if (data.otp === '123456') {
            return Promise.resolve({
                success: true,
                token: 'mock-teacher-token',
                user: mockUsers.teacher
            });
        }
        return Promise.reject(new Error('Invalid OTP'));
    },

    verifyTeacherRegister: (data) => {
        if (data.otp === '123456') {
            return Promise.resolve({
                success: true,
                token: 'mock-teacher-token',
                user: mockUsers.teacher
            });
        }
        return Promise.reject(new Error('Invalid OTP'));
    }
}; 