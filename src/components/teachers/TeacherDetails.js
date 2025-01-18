// src/components/teachers/TeacherDetails.js
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
import { teacherService } from '../../services/teacherService';

const TeacherDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [teacher, setTeacher] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        setLoading(true);
        try {
            const teacherResponse = await teacherService.getTeacherById(id);
            setTeacher(teacherResponse.data);
            // If you have an endpoint to get subjects taught by teacher
            // const subjectsResponse = await teacherService.getTeacherSubjects(id);
            // setSubjects(subjectsResponse.data);
        } catch (error) {
            setError('Error loading teacher details');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container>
                <Alert severity="error" sx={{ mt: 3 }}>
                    {error}
                </Alert>
            </Container>
        );
    }

    if (!teacher) {
        return (
            <Container>
                <Alert severity="info" sx={{ mt: 3 }}>
                    Teacher not found
                </Alert>
            </Container>
        );
    }

    return (
        <Container>
            <Paper sx={{ p: 3, mt: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Teacher Details
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1">First Name</Typography>
                        <Typography variant="body1">{teacher.firstName}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1">Last Name</Typography>
                        <Typography variant="body1">{teacher.lastName}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1">Email</Typography>
                        <Typography variant="body1">{teacher.email}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1">Phone</Typography>
                        <Typography variant="body1">{teacher.phoneNumber}</Typography>
                    </Grid>
                </Grid>

                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                    <Button variant="outlined" onClick={() => navigate('/teachers')}>
                        Back to List
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => navigate(`/teachers/edit/${id}`)}
                    >
                        Edit Teacher
                    </Button>
                </Box>
            </Paper>

            {subjects.length > 0 && (
                <Paper sx={{ p: 3, mt: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Subjects Teaching
                    </Typography>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Subject Name</TableCell>
                                <TableCell>Subject Code</TableCell>
                                <TableCell>Credits</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {subjects.map((subject) => (
                                <TableRow key={subject.id}>
                                    <TableCell>{subject.subjectName}</TableCell>
                                    <TableCell>{subject.subjectCode}</TableCell>
                                    <TableCell>{subject.credits}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            )}
        </Container>
    );
};

export default TeacherDetails;
