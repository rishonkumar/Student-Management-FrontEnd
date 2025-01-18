// src/components/layout/Sidebar.js
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { School, Person, Book, Assignment } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const navigate = useNavigate();

    const menuItems = [
        { text: 'Students', icon: <School />, path: '/students' },
        { text: 'Teachers', icon: <Person />, path: '/teachers' },
        { text: 'Subjects', icon: <Book />, path: '/subjects' },
        { text: 'Enrollments', icon: <Assignment />, path: '/enrollments' }
    ];

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: 240,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: 240,
                    boxSizing: 'border-box',
                    marginTop: '64px'
                },
            }}
        >
            <List>
                {menuItems.map((item) => (
                    <ListItem button key={item.text} onClick={() => navigate(item.path)}>
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
};

export default Sidebar;
