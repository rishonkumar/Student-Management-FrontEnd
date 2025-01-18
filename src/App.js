// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import StudentList from './components/students/StudentList';
import TeacherList from './components/teachers/TeacherList';
import SubjectList from './components/subjects/SubjectList';
import EnrollmentList from './components/enrollments/EnrollmentList';
import StudentForm from "./components/students/StudentForm";
import StudentDetails from "./components/students/StudentDetails";

function App() {
  return (
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<StudentList />} />
              <Route path="/students" element={<StudentList />} />
              <Route path="/students/new" element={<StudentForm />} />
              <Route path="/students/edit/:id" element={<StudentForm />} />
              <Route path="/students/:id" element={<StudentDetails />} />

              <Route path="/teachers" element={<TeacherList />} />
            <Route path="/subjects" element={<SubjectList />} />
            <Route path="/enrollments" element={<EnrollmentList />} />
          </Routes>
        </Layout>
      </Router>
  );
}

export default App;
