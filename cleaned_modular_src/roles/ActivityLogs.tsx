// src/components/Dashboard/ActivityLogs.tsx
import React from 'react';
import { Paper, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';

interface ActivityLogsProps {
  activityLogs: string[];
}

const ActivityLogs: React.FC<ActivityLogsProps> = ({ activityLogs }) => (
  <Paper elevation={3} sx={{ padding: 2, backgroundColor: '#e3f2fd', height: '100%' }}>
    <Typography variant="h6" gutterBottom>
      Recent Activity
    </Typography>
    {activityLogs.length ? (
      <List>
        {activityLogs.map((log, index) => (
          <ListItem key={index}>
            <ListItemIcon>
              <HistoryIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary={log} />
          </ListItem>
        ))}
      </List>
    ) : (
      <Typography>No recent activity found.</Typography>
    )}
  </Paper>
);

export default ActivityLogs;
