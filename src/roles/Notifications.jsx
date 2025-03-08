// src/roles/Notifications.jsx

import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PropTypes from 'prop-types';

const Notifications = ({ notifications }) => {
  return (
    <Card elevation={3} sx={{ padding: 2, backgroundColor: 'background.paper' }}>
      <Typography variant="h5" gutterBottom>
        Notifications
      </Typography>
      <List>
        {notifications.map((notification) => (
          <ListItem key={notification.id}>
            <ListItemIcon>
              <NotificationsIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary={notification.message} secondary={notification.time} />
          </ListItem>
        ))}
        {notifications.length === 0 && (
          <Typography variant="body2" color="textSecondary">
            No new notifications.
          </Typography>
        )}
      </List>
    </Card>
  );
};

Notifications.propTypes = {
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      message: PropTypes.string.isRequired,
      time: PropTypes.string,
    })
  ).isRequired,
};

export default Notifications;