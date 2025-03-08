// src/components/Dashboard/UpcomingEvents.jsx
import React from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';

const UpcomingEvents = ({ events }) => (
  <Paper
    elevation={3}
    sx={{ padding: 2, backgroundColor: '#e3f2fd', height: '100%' }}
  >
    <Typography variant="h6" gutterBottom>
      Upcoming Events
    </Typography>
    {events.length ? (
      <List>
        {events.map((event, index) => (
          <ListItem key={index}>
            <ListItemIcon>
              <EventIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary={event} />
          </ListItem>
        ))}
      </List>
    ) : (
      <Typography>No upcoming events.</Typography>
    )}
  </Paper>
);

export default UpcomingEvents;