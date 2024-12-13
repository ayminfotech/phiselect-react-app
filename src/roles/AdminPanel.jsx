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
  CircularProgress,
  Chip,
  FormControlLabel,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockResetIcon from '@mui/icons-material/LockReset'; // Icon for password reset
import { DataGrid } from '@mui/x-data-grid';
import {
  createUser,
  getUsersByTenantId,
  updateUser,
  deleteUser,
  assignRoleToUser,
  changeUserPassword,
} from '../services/UserService';
import { AuthContext } from '../components/auth/AuthContext'; // Corrected import path

// Styled Components for better UI
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.paper,
}));

const RoleChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

const AdminPanel = () => {
  // Access AuthContext to get tenantId
  const { auth } = useContext(AuthContext);
  const { tenantId } = auth || {};

  // State Management
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openResetPassword, setOpenResetPassword] = useState(false); // State for reset password dialog
  const [createFormData, setCreateFormData] = useState({
    email: '',
    firstname: '',
    lastname: '',
    password: '',
    superAdmin: false,
    roles: [],
  });
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
  const [resetPasswordData, setResetPasswordData] = useState({
    userId: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [users, setUsers] = useState([]);
  const [rolesOptions] = useState(['ADMIN', 'MANAGER', 'RECRUITER', 'INTERVIEWER']);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false); // Loading state for password reset

  // Fetch users on component mount
  useEffect(() => {
    if (tenantId) {
      fetchUsers(tenantId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenantId]);

  const fetchUsers = async (tenantId) => {
    setLoading(true);
    try {
      const data = await getUsersByTenantId(tenantId);
      setUsers(data);
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch users.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // Dialog Handlers
  const handleOpenCreate = () => setOpenCreate(true);
  const handleCloseCreate = () => {
    setOpenCreate(false);
    resetCreateForm();
  };

  const handleOpenEdit = (user) => {
    setEditFormData({
      id: user.id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      password: '',
      superAdmin: user.superAdmin,
      roles: user.roles,
      status: user.status,
    });
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    resetEditForm();
  };

  const handleOpenDelete = (user) => {
    setSelectedUser(user);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
    setSelectedUser(null);
  };

  const handleOpenResetPassword = (user) => {
    setSelectedUser(user);
    setResetPasswordData({
      userId: user.id,
      newPassword: '',
      confirmPassword: '',
    });
    setOpenResetPassword(true);
  };

  const handleCloseResetPassword = () => {
    setOpenResetPassword(false);
    setSelectedUser(null);
    setResetPasswordData({
      userId: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  // Form Reset Functions
  const resetCreateForm = () => {
    setCreateFormData({
      email: '',
      firstname: '',
      lastname: '',
      password: '',
      superAdmin: false,
      roles: [],
    });
  };

  const resetEditForm = () => {
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

  // Handle form input changes
  const handleCreateChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCreateFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleResetPasswordChange = (e) => {
    const { name, value } = e.target;
    setResetPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle roles selection
  const handleCreateRolesChange = (event) => {
    const { target: { value } } = event;
    setCreateFormData((prev) => ({
      ...prev,
      roles: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const handleEditRolesChange = (event) => {
    const { target: { value } } = event;
    setEditFormData((prev) => ({
      ...prev,
      roles: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  // Handle Create User Submission
  const handleCreateSubmit = async () => {
    const { email, firstname, lastname, password, superAdmin, roles } = createFormData;

    // Form Validation
    if (!email || !firstname || !lastname || !password) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields.',
        severity: 'warning',
      });
      return;
    }

    const userPayload = {
      email,
      firstname,
      lastname,
      password,
      superAdmin,
      roles,
      tenant: {
        tenantId,
        name: 'AYP Technologies', // Ideally, this should come from context or a separate source
      },
    };

    try {
      const response = await createUser(userPayload);
      setSnackbar({
        open: true,
        message: 'User created successfully!',
        severity: 'success',
      });
      handleCloseCreate();
      fetchUsers(tenantId);
      // Optionally, handle the returned password securely here
      // For example, notify the admin to communicate the password securely to the user
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to create user.',
        severity: 'error',
      });
    }
  };

  // Handle Edit User Submission
  const handleEditSubmit = async () => {
    const { id, email, firstname, lastname, password, superAdmin, roles, status } = editFormData;

    // Form Validation
    if (!email || !firstname || !lastname) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields.',
        severity: 'warning',
      });
      return;
    }

    const userPayload = {
      email,
      firstname,
      lastname,
      superAdmin,
      roles,
      status,
      tenant: {
        tenantId,
        name: 'AYP Technologies', // Ideally, this should come from context or a separate source
      },
    };

    if (password) {
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
      fetchUsers(tenantId);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to update user.',
        severity: 'error',
      });
    }
  };

  // Handle Delete Confirmation
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
      fetchUsers(tenantId);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to delete user.',
        severity: 'error',
      });
    }
  };

  // Handle Reset Password Submission
  const handleResetPasswordSubmit = async () => {
    const { userId, newPassword, confirmPassword } = resetPasswordData;

    // Form Validation
    if (!newPassword || !confirmPassword) {
      setSnackbar({
        open: true,
        message: 'Please fill in all password fields.',
        severity: 'warning',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setSnackbar({
        open: true,
        message: 'Passwords do not match.',
        severity: 'warning',
      });
      return;
    }

    setResetLoading(true);
    try {
      await changeUserPassword({
        currentPassword: '', // Not required for admin resetting password
        newPassword,
        confirmationPassword: confirmPassword,
      });
      setSnackbar({
        open: true,
        message: 'Password reset successfully!',
        severity: 'success',
      });
      handleCloseResetPassword();
      fetchUsers(tenantId);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to reset password.',
        severity: 'error',
      });
    } finally {
      setResetLoading(false);
    }
  };

  // Snackbar Handler
  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  // Define columns for DataGrid with enhanced role display and password reset action
  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'firstname', headerName: 'First Name', width: 130 },
    { field: 'lastname', headerName: 'Last Name', width: 130 },
    { field: 'tenantName', headerName: 'Tenant Name', width: 180 },
    { field: 'tenantId', headerName: 'Tenant ID', width: 180 },
    {
      field: 'superAdmin',
      headerName: 'Super Admin',
      width: 130,
      type: 'boolean',
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'roles',
      headerName: 'Roles',
      width: 250,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {params.value.map((role) => (
            <RoleChip key={role} label={role} color="primary" size="small" />
          ))}
        </Box>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Typography color={params.value === 'Active' ? 'green' : 'red'}>
          {params.value}
        </Typography>
      ),
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 250,
      sortable: false,
      filterable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        const user = params.row;
        return (
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
            <Tooltip title="Edit User">
              <IconButton color="primary" onClick={() => handleOpenEdit(user)}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete User">
              <IconButton color="error" onClick={() => handleOpenDelete(user)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Reset Password">
              <IconButton color="secondary" onClick={() => handleOpenResetPassword(user)}>
                <LockResetIcon />
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
    status: user.status || 'Active', // Default status if not provided
  }));

  return (
    <StyledPaper elevation={3}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <Typography variant="h5">Admin Panel</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate}>
          Create User
        </Button>
      </Box>

      {/* Users DataGrid */}
      <Box sx={{ height: 600, width: '100%', marginBottom: 4 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 20, 50]}
            disableSelectionOnClick
            autoHeight
            sx={{
              '& .MuiDataGrid-row:hover': {
                backgroundColor: '#f5f5f5',
              },
            }}
          />
        )}
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
            <FormControlLabel
              control={
                <Checkbox
                  checked={createFormData.superAdmin}
                  onChange={handleCreateChange}
                  name="superAdmin"
                />
              }
              label="Super Admin"
            />
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
            <FormControlLabel
              control={
                <Checkbox
                  checked={editFormData.superAdmin}
                  onChange={handleEditChange}
                  name="superAdmin"
                />
              }
              label="Super Admin"
            />
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

      {/* Reset Password Dialog */}
      <Dialog open={openResetPassword} onClose={handleCloseResetPassword} fullWidth maxWidth="sm">
        <DialogTitle>Reset Password for {selectedUser?.email}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 1 }}>
            <TextField
              label="New Password"
              name="newPassword"
              variant="outlined"
              value={resetPasswordData.newPassword}
              onChange={handleResetPasswordChange}
              required
              type="password"
            />
            <TextField
              label="Confirm New Password"
              name="confirmPassword"
              variant="outlined"
              value={resetPasswordData.confirmPassword}
              onChange={handleResetPasswordChange}
              required
              type="password"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseResetPassword} color="secondary" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleResetPasswordSubmit} color="primary" variant="contained" disabled={resetLoading}>
            {resetLoading ? <CircularProgress size={24} /> : 'Reset Password'}
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
    </StyledPaper>
  );
};

export default AdminPanel; 