// src/services/studentService.js
import api from './api';

export const studentService = {
    getAllStudents: () => api.get('/students'),
    getStudentById: (id) => api.get(`/students/${id}`),
    createStudent: (data) => api.post('/students', data),
    updateStudent: (id, data) => api.put(`/students/${id}`, data),
    deleteStudent: (id) => api.delete(`/students/${id}`),
    searchStudents: (term) => api.get(`/students/search?searchTerm=${term}`),
    getStudentEnrollments: (studentId) => api.get(`/students/${studentId}/enrollments`),

};
