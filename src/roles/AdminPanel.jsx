// src/components/roles/AdminPanel.jsx

import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  IconButton,
  Tooltip,
  DialogContentText,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid } from '@mui/x-data-grid';
import { createUser, getAllUsers, updateUser, deleteUser } from '../services/UserService';
import PropTypes from 'prop-types';
import { AuthContext } from '../components/auth/AuthContext'; // Import AuthContext

const AdminPanel = () => {
  // Access AuthContext to get tenantId
  const { auth } = useContext(AuthContext);
  const { tenantId, roles } = auth || {};

  // State for user creation dialog
  const [openCreate, setOpenCreate] = useState(false);

  // State for user editing dialog
  const [openEdit, setOpenEdit] = useState(false);

  // State for delete confirmation dialog
  const [openDelete, setOpenDelete] = useState(false);

  // State for form inputs (Create)
  const [createFormData, setCreateFormData] = useState({
    email: '',
    firstname: '',
    lastname: '',
    password: '',
    superAdmin: false,
    roles: [],
  });

  // State for form inputs (Edit)
  const [editFormData, setEditFormData] = useState({
    id: '',
    email: '',
    firstname: '',
    lastname: '',
    password: '',
    superAdmin: false,
    roles: [],
    status: '',
  });

  // State for users list
  const [users, setUsers] = useState([]);

  // State for roles options
  const rolesOptions = ['ADMIN', 'MANAGER', 'RECRUITER', 'INTERVIEWER'];

  // State for notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success', // 'success' | 'error' | 'warning' | 'info'
  });

  // State for selected user to delete
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch users.',
        severity: 'error',
      });
    }
  };

  // Handle Create Dialog open/close
  const handleClickOpenCreate = () => {
    setOpenCreate(true);
  };

  const handleCloseCreate = () => {
    setOpenCreate(false);
    // Reset form
    setCreateFormData({
      email: '',
      firstname: '',
      lastname: '',
      password: '',
      superAdmin: false,
      roles: [],
    });
  };

  // Handle Edit Dialog open/close
  const handleClickOpenEdit = (user) => {
    setEditFormData({
      id: user.id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      password: '', // Leave empty to not change password
      superAdmin: user.superAdmin,
      roles: user.roles,
      status: user.status,
    });
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    // Reset form
    setEditFormData({
      id: '',
      email: '',
      firstname: '',
      lastname: '',
      password: '',
      superAdmin: false,
      roles: [],
      status: '',
    });
  };

  // Handle Delete Dialog open/close
  const handleClickOpenDelete = (user) => {
    setSelectedUser(user);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
    setSelectedUser(null);
  };

  // Handle form input changes (Create)
  const handleCreateChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCreateFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle form input changes (Edit)
  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle roles selection (Create)
  const handleCreateRolesChange = (event) => {
    const {
      target: { value },
    } = event;
    setCreateFormData((prev) => ({
      ...prev,
      roles: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  // Handle roles selection (Edit)
  const handleEditRolesChange = (event) => {
    const {
      target: { value },
    } = event;
    setEditFormData((prev) => ({
      ...prev,
      roles: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  // Handle Create form submission
  const handleCreateSubmit = async () => {
    const {
      email,
      firstname,
      lastname,
      password,
      superAdmin,
      roles,
    } = createFormData;

    // Basic validation
    if (!email || !firstname || !lastname || !password) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields.',
        severity: 'warning',
      });
      return;
    }

    // Prepare user payload
    const userPayload = {
      email,
      firstname,
      lastname,
      password,
      superAdmin,
      roles,
      tenantId, // Automatically include Tenant ID from AuthContext
    };

    try {
      await createUser(userPayload);
      setSnackbar({
        open: true,
        message: 'User created successfully!',
        severity: 'success',
      });
      handleCloseCreate();
      fetchUsers(); // Refresh users list
    } catch (error) {
      setSnackbar({
        open: true,
        message: error || 'Failed to create user.',
        severity: 'error',
      });
    }
  };

  // Handle Edit form submission
  const handleEditSubmit = async () => {
    const {
      id,
      email,
      firstname,
      lastname,
      password, // Optional: Only send if changing password
      superAdmin,
      roles,
      status,
    } = editFormData;

    // Basic validation
    if (!email || !firstname || !lastname) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields.',
        severity: 'warning',
      });
      return;
    }

    // Prepare user payload
    const userPayload = {
      email,
      firstname,
      lastname,
      superAdmin,
      roles,
      status,
      tenantId, // Automatically include Tenant ID from AuthContext
    };

    // Only include password if it's being changed
    if (password && password.length > 0) {
      userPayload.password = password;
    }

    try {
      await updateUser(id, userPayload);
      setSnackbar({
        open: true,
        message: 'User updated successfully!',
        severity: 'success',
      });
      handleCloseEdit();
      fetchUsers(); // Refresh users list
    } catch (error) {
      setSnackbar({
        open: true,
        message: error || 'Failed to update user.',
        severity: 'error',
      });
    }
  };

  // Handle Delete confirmation
  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;

    try {
      await deleteUser(selectedUser.id);
      setSnackbar({
        open: true,
        message: 'User deleted successfully!',
        severity: 'success',
      });
      handleCloseDelete();
      fetchUsers(); // Refresh users list
    } catch (error) {
      setSnackbar({
        open: true,
        message: error || 'Failed to delete user.',
        severity: 'error',
      });
    }
  };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  // Define columns for DataGrid with Edit and Delete actions
  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'firstname', headerName: 'First Name', width: 130 },
    { field: 'lastname', headerName: 'Last Name', width: 130 },
    { field: 'tenantName', headerName: 'Tenant Name', width: 180 },
    { field: 'tenantId', headerName: 'Tenant ID', width: 180 },
    { field: 'superAdmin', headerName: 'Super Admin', width: 130, type: 'boolean' },
    {
      field: 'roles',
      headerName: 'Roles',
      width: 200,
      renderCell: (params) => params.value.join(', '),
    },
    { field: 'status', headerName: 'Status', width: 100 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const user = params.row;
        return (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Edit User">
              <IconButton color="primary" onClick={() => handleClickOpenEdit(user)}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete User">
              <IconButton color="error" onClick={() => handleClickOpenDelete(user)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  // Prepare rows for DataGrid
  const rows = users.map((user) => ({
    id: user.id,
    email: user.email,
    firstname: user.firstname,
    lastname: user.lastname,
    tenantName: user.tenant?.name || '',
    tenantId: user.tenant?.tenantId || '',
    superAdmin: user.superAdmin,
    roles: user.roles,
    status: user.status,
  }));

  return (
    <Paper sx={{ padding: 4, backgroundColor: 'background.paper' }} elevation={3}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <Typography variant="h5">Admin Panel</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleClickOpenCreate}>
          Create User
        </Button>
      </Box>

      {/* Users DataGrid */}
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
          disableSelectionOnClick
          sx={{
            '& .MuiDataGrid-row:hover': {
              backgroundColor: '#f5f5f5',
            },
          }}
        />
      </Box>

      {/* Create User Dialog */}
      <Dialog open={openCreate} onClose={handleCloseCreate} fullWidth maxWidth="sm">
        <DialogTitle>Create New User</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 1 }}>
            <TextField
              label="Email"
              name="email"
              variant="outlined"
              value={createFormData.email}
              onChange={handleCreateChange}
              required
              type="email"
            />
            <TextField
              label="First Name"
              name="firstname"
              variant="outlined"
              value={createFormData.firstname}
              onChange={handleCreateChange}
              required
            />
            <TextField
              label="Last Name"
              name="lastname"
              variant="outlined"
              value={createFormData.lastname}
              onChange={handleCreateChange}
              required
            />
            <TextField
              label="Password"
              name="password"
              variant="outlined"
              value={createFormData.password}
              onChange={handleCreateChange}
              required
              type="password"
            />
            {/* Removed Tenant Name and Tenant ID Fields */}
            <FormControl>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Checkbox
                  checked={createFormData.superAdmin}
                  onChange={handleCreateChange}
                  name="superAdmin"
                />
                <Typography>Super Admin</Typography>
              </Box>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="create-roles-label">Roles</InputLabel>
              <Select
                labelId="create-roles-label"
                multiple
                value={createFormData.roles}
                onChange={handleCreateRolesChange}
                renderValue={(selected) => selected.join(', ')}
                label="Roles"
              >
                {rolesOptions.map((role) => (
                  <MenuItem key={role} value={role}>
                    <Checkbox checked={createFormData.roles.indexOf(role) > -1} />
                    <ListItemText primary={role} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreate} color="secondary" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleCreateSubmit} color="primary" variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={openEdit} onClose={handleCloseEdit} fullWidth maxWidth="sm">
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 1 }}>
            <TextField
              label="Email"
              name="email"
              variant="outlined"
              value={editFormData.email}
              onChange={handleEditChange}
              required
              type="email"
            />
            <TextField
              label="First Name"
              name="firstname"
              variant="outlined"
              value={editFormData.firstname}
              onChange={handleEditChange}
              required
            />
            <TextField
              label="Last Name"
              name="lastname"
              variant="outlined"
              value={editFormData.lastname}
              onChange={handleEditChange}
              required
            />
            <TextField
              label="Password"
              name="password"
              variant="outlined"
              value={editFormData.password}
              onChange={handleEditChange}
              type="password"
              helperText="Leave blank to keep existing password"
            />
            {/* Removed Tenant Name and Tenant ID Fields */}
            <FormControl>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Checkbox
                  checked={editFormData.superAdmin}
                  onChange={handleEditChange}
                  name="superAdmin"
                />
                <Typography>Super Admin</Typography>
              </Box>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="edit-roles-label">Roles</InputLabel>
              <Select
                labelId="edit-roles-label"
                multiple
                value={editFormData.roles}
                onChange={handleEditRolesChange}
                renderValue={(selected) => selected.join(', ')}
                label="Roles"
              >
                {rolesOptions.map((role) => (
                  <MenuItem key={role} value={role}>
                    <Checkbox checked={editFormData.roles.indexOf(role) > -1} />
                    <ListItemText primary={role} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="edit-status-label">Status</InputLabel>
              <Select
                labelId="edit-status-label"
                name="status"
                value={editFormData.status}
                onChange={handleEditChange}
                label="Status"
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit} color="secondary" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDelete} onClose={handleCloseDelete}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete user <strong>{selectedUser?.email}</strong>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete} color="secondary" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

AdminPanel.propTypes = {
  // Define prop types if needed
};

export default AdminPanel;