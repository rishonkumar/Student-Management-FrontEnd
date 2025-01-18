// src/components/layout/Navbar.js
import { AppBar, Toolbar, Typography } from '@mui/material';

const Navbar = () => {
    return (
        <AppBar position="fixed">
            <Toolbar>
                <Typography variant="h6" noWrap component="div">
                    Student Management System
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
