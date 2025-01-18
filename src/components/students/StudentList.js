import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    IconButton,
    TextField,
    Box,
    Typography,
    Snackbar,
    Alert,
    CircularProgress,
    Container,
    TablePagination,
    TableSortLabel
} from '@mui/material';
import { Edit, Delete, Add, Visibility } from '@mui/icons-material';
import { studentService } from '../../services/studentService';

const StudentList = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [orderBy, setOrderBy] = useState('id');
    const [order, setOrder] = useState('asc');
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = async () => {
        setLoading(true);
        try {
            const response = await studentService.getAllStudents();
            setStudents(response.data);
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Error loading students',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                await studentService.deleteStudent(id);
                setSnackbar({
                    open: true,
                    message: 'Student deleted successfully',
                    severity: 'success'
                });
                loadStudents();
            } catch (error) {
                setSnackbar({
                    open: true,
                    message: 'Error deleting student',
                    severity: 'error'
                });
            }
        }
    };

    const handleSearch = async (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        setLoading(true);

        try {
            if (value) {
                const response = await studentService.searchStudents(value);
                setStudents(response.data);
            } else {
                loadStudents();
            }
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Error searching students',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);

        const sortedStudents = [...students].sort((a, b) => {
            if (property === 'dateOfBirth') {
                return order === 'asc'
                    ? new Date(a[property]) - new Date(b[property])
                    : new Date(b[property]) - new Date(a[property]);
            }
            return order === 'asc'
                ? a[property] > b[property] ? 1 : -1
                : b[property] > a[property] ? 1 : -1;
        });

        setStudents(sortedStudents);
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <Container>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ mb: 2 }}>
                    Student Management
                </Typography>

                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TextField
                        label="Search Students"
                        variant="outlined"
                        value={searchTerm}
                        onChange={handleSearch}
                        sx={{ width: '300px' }}
                        placeholder="Search by name or email..."
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Add />}
                        onClick={() => navigate('/students/new')}
                    >
                        Add Student
                    </Button>
                </Box>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Paper>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            <TableSortLabel
                                                active={orderBy === 'id'}
                                                direction={orderBy === 'id' ? order : 'asc'}
                                                onClick={() => handleSort('id')}
                                            >
                                                ID
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell>
                                            <TableSortLabel
                                                active={orderBy === 'firstName'}
                                                direction={orderBy === 'firstName' ? order : 'asc'}
                                                onClick={() => handleSort('firstName')}
                                            >
                                                First Name
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell>
                                            <TableSortLabel
                                                active={orderBy === 'lastName'}
                                                direction={orderBy === 'lastName' ? order : 'asc'}
                                                onClick={() => handleSort('lastName')}
                                            >
                                                Last Name
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell>
                                            <TableSortLabel
                                                active={orderBy === 'email'}
                                                direction={orderBy === 'email' ? order : 'asc'}
                                                onClick={() => handleSort('email')}
                                            >
                                                Email
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell>Phone</TableCell>
                                        <TableCell>
                                            <TableSortLabel
                                                active={orderBy === 'dateOfBirth'}
                                                direction={orderBy === 'dateOfBirth' ? order : 'asc'}
                                                onClick={() => handleSort('dateOfBirth')}
                                            >
                                                Date of Birth
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell align="center">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {students.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} align="center">
                                                No students found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        students
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((student) => (
                                                <TableRow key={student.id}>
                                                    <TableCell>{student.id}</TableCell>
                                                    <TableCell>{student.firstName}</TableCell>
                                                    <TableCell>{student.lastName}</TableCell>
                                                    <TableCell>{student.email}</TableCell>
                                                    <TableCell>{student.phoneNumber}</TableCell>
                                                    <TableCell>{formatDate(student.dateOfBirth)}</TableCell>
                                                    <TableCell align="center">
                                                        <IconButton
                                                            color="primary"
                                                            onClick={() => navigate(`/students/${student.id}`)}
                                                            title="View Details"
                                                        >
                                                            <Visibility />
                                                        </IconButton>
                                                        <IconButton
                                                            color="primary"
                                                            onClick={() => navigate(`/students/edit/${student.id}`)}
                                                            title="Edit"
                                                        >
                                                            <Edit />
                                                        </IconButton>
                                                        <IconButton
                                                            color="error"
                                                            onClick={() => handleDelete(student.id)}
                                                            title="Delete"
                                                        >
                                                            <Delete />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            component="div"
                            count={students.length}
                            page={page}
                            onPageChange={(e, newPage) => setPage(newPage)}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={(e) => {
                                setRowsPerPage(parseInt(e.target.value, 10));
                                setPage(0);
                            }}
                            rowsPerPageOptions={[5, 10, 25]}
                        />
                    </Paper>
                )}
            </Box>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    variant="filled"
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default StudentList;
