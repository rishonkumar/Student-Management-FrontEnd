// src/components/students/StudentDetails.js
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Paper,
    Typography,
    Grid,
    Button,
    Box,
    CircularProgress,
    Container,
    Alert,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell
} from '@mui/material';
import { studentService } from '../../services/studentService';

const StudentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Add console log to verify ID
        console.log('Loading student with ID:', id);
        loadData();
    }, [id]);

    const loadData = async () => {
        setLoading(true);
        try {
            // Log the API call
            console.log('Making API call to:', `/api/students/${id}`);
            const studentResponse = await studentService.getStudentById(id);
            console.log('Student data received:', studentResponse.data);

            if (!studentResponse.data) {
                throw new Error('No student data received');
            }

            setStudent(studentResponse.data);

            try {
                console.log('Fetching enrollments for student:', id);
                const enrollmentsResponse = await studentService.getStudentEnrollments(id);
                setEnrollments(enrollmentsResponse.data || []);
            } catch (enrollError) {
                console.warn('Error loading enrollments:', enrollError);
                setEnrollments([]);
                // Don't set error state for enrollments failure
            }
        } catch (error) {
            console.error('Error details:', {
                message: error.message,
                response: error.response,
                status: error.response?.status
            });
            setError(error.message || 'Error loading student details');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString();
    };

    if (loading) {
        return (
            <Container>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <Alert
                    severity="error"
                    sx={{ mt: 3 }}
                    action={
                        <Button color="inherit" size="small" onClick={() => loadData()}>
                            Retry
                        </Button>
                    }
                >
                    {error}
                </Alert>
            </Container>
        );
    }
    if (!student) {
        return (
            <Container>
                <Alert severity="info" sx={{ mt: 3 }}>
                    No student data found
                </Alert>
                <Button
                    sx={{ mt: 2 }}
                    variant="contained"
                    onClick={() => navigate('/students')}
                >
                    Back to List
                </Button>
            </Container>
        );
    }

    return (
        <Container>
            <Paper sx={{ p: 3, mt: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Student Details
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1">First Name</Typography>
                        <Typography variant="body1">{student.firstName}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1">Last Name</Typography>
                        <Typography variant="body1">{student.lastName}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1">Email</Typography>
                        <Typography variant="body1">{student.email}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1">Phone</Typography>
                        <Typography variant="body1">{student.phoneNumber}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1">Date of Birth</Typography>
                        <Typography variant="body1">
                            {formatDate(student.dateOfBirth)}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1">Address</Typography>
                        <Typography variant="body1">{student.address}</Typography>
                    </Grid>
                </Grid>

                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                    <Button variant="outlined" onClick={() => navigate('/students')}>
                        Back to List
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => navigate(`/students/edit/${id}`)}
                    >
                        Edit Student
                    </Button>
                </Box>
            </Paper>

            {enrollments.length > 0 && (
                <Paper sx={{ p: 3, mt: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Enrolled Subjects
                    </Typography>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Subject Name</TableCell>
                                <TableCell>Enrollment Date</TableCell>
                                <TableCell>Fees</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {enrollments.map((enrollment) => (
                                <TableRow key={enrollment.id}>
                                    <TableCell>{enrollment.subject.subjectName}</TableCell>
                                    <TableCell>{formatDate(enrollment.enrollmentDate)}</TableCell>
                                    <TableCell>${enrollment.fees}</TableCell>
                                    <TableCell>{enrollment.feesPaid ? 'Paid' : 'Pending'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            )}
        </Container>
    );
};

export default StudentDetails;
