// src/components/teachers/TeacherList.js
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
import { teacherService } from '../../services/teacherService';

const TeacherList = () => {
    const navigate = useNavigate();
    const [teachers, setTeachers] = useState([]);
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
        loadTeachers();
    }, []);

    const loadTeachers = async () => {
        setLoading(true);
        try {
            const response = await teacherService.getAllTeachers();
            setTeachers(response.data);
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Error loading teachers',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };


    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this teacher?')) {
            try {
                await teacherService.deleteTeacher(id);
                setSnackbar({
                    open: true,
                    message: 'Teacher deleted successfully',
                    severity: 'success'
                });
                loadTeachers();
            } catch (error) {
                setSnackbar({
                    open: true,
                    message: 'Error deleting teacher',
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
                const response = await teacherService.searchTeachers(value);
                setTeachers(response.data);
            } else {
                loadTeachers();
            }
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Error searching teachers',
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

        const sortedTeachers = [...teachers].sort((a, b) => {
            return order === 'asc'
                ? a[property] > b[property] ? 1 : -1
                : b[property] > a[property] ? 1 : -1;
        });

        setTeachers(sortedTeachers);
    };

    return (
        <Container>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ mb: 2 }}>
                    Teacher Management
                </Typography>

                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TextField
                        label="Search Teachers"
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
                        onClick={() => navigate('/teachers/new')}
                    >
                        Add Teacher
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
                                        <TableCell align="center">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {teachers.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center">
                                                No teachers found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        teachers
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((teacher) => (
                                                <TableRow key={teacher.id}>
                                                    <TableCell>{teacher.id}</TableCell>
                                                    <TableCell>{teacher.firstName}</TableCell>
                                                    <TableCell>{teacher.lastName}</TableCell>
                                                    <TableCell>{teacher.email}</TableCell>
                                                    <TableCell>{teacher.phoneNumber}</TableCell>
                                                    <TableCell align="center">
                                                        <IconButton
                                                            color="primary"
                                                            onClick={() => navigate(`/teachers/${teacher.id}`)}
                                                            title="View Details"
                                                        >
                                                            <Visibility />
                                                        </IconButton>
                                                        <IconButton
                                                            color="primary"
                                                            onClick={() => navigate(`/teachers/edit/${teacher.id}`)}
                                                            title="Edit"
                                                        >
                                                            <Edit />
                                                        </IconButton>
                                                        <IconButton
                                                            color="error"
                                                            onClick={() => handleDelete(teacher.id)}
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
                            count={teachers.length}
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
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert severity={snackbar.severity} variant="filled">
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default TeacherList;
