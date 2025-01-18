// src/components/teachers/TeacherForm.js
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Paper,
    TextField,
    Button,
    Grid,
    Typography,
    Box,
    Container,
    Alert,
    Snackbar
} from '@mui/material';
import { teacherService } from '../../services/teacherService';

const TeacherForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: ''
    });
    const [errors, setErrors] = useState({});
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    useEffect(() => {
        if (id) {
            loadTeacher();
        }
    }, [id]);

    const loadTeacher = async () => {
        try {
            const response = await teacherService.getTeacherById(id);
            setFormData(response.data);
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Error loading teacher data',
                severity: 'error'
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.firstName?.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName?.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email?.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }
        if (!formData.phoneNumber?.trim()) newErrors.phoneNumber = 'Phone number is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            if (id) {
                await teacherService.updateTeacher(id, formData);
                setSnackbar({
                    open: true,
                    message: 'Teacher updated successfully',
                    severity: 'success'
                });
            } else {
                await teacherService.createTeacher(formData);
                setSnackbar({
                    open: true,
                    message: 'Teacher created successfully',
                    severity: 'success'
                });
            }
            navigate('/teachers');
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Error saving teacher',
                severity: 'error'
            });
        }
    };

    return (
        <Container>
            <Paper sx={{ p: 3, mt: 3 }}>
                <Typography variant="h5" gutterBottom>
                    {id ? 'Edit Teacher' : 'Add New Teacher'}
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                name="firstName"
                                label="First Name"
                                value={formData.firstName}
                                onChange={handleChange}
                                error={!!errors.firstName}
                                helperText={errors.firstName}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                name="lastName"
                                label="Last Name"
                                value={formData.lastName}
                                onChange={handleChange}
                                error={!!errors.lastName}
                                helperText={errors.lastName}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                name="email"
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                error={!!errors.email}
                                helperText={errors.email}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                name="phoneNumber"
                                label="Phone Number"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                error={!!errors.phoneNumber}
                                helperText={errors.phoneNumber}
                                required
                            />
                        </Grid>
                    </Grid>
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button variant="outlined" onClick={() => navigate('/teachers')}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" color="primary">
                            {id ? 'Update Teacher' : 'Create Teacher'}
                        </Button>
                    </Box>
                </form>
            </Paper>
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

export default TeacherForm;
