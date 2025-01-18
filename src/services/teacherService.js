import api from './api';

export const teacherService = {
    getAllTeachers: () => api.get('/teachers'),
    getTeacherById: (id) => api.get(`/teachers/${id}`),
    createTeacher: (data) => api.post('/teachers', data),
    updateTeacher: (id, data) => api.put(`/teachers/${id}`, data),
    deleteTeacher: (id) => api.delete(`/teachers/${id}`),
    searchTeachers: (term) => api.get(`/teachers/search?searchTerm=${term}`),
    getTeacherCourses: (teacherId) => api.get(`/teachers/${teacherId}/courses`),
    getTeacherEnrollments: (teacherId) => api.get(`/teachers/${teacherId}/enrollments`),
}
