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
  Grid,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockResetIcon from '@mui/icons-material/LockReset';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { createUser, getUsersByTenantId, updateUser, deleteUser, changeUserPassword } from '../services/UserService';
import { AuthContext } from '../components/auth/AuthContext';
import { useSnackbar } from 'notistack';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
}));

const RoleChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

const AdminPanel = () => {
  const { auth } = useContext(AuthContext);
  const { tenantId } = auth || {};
  const { enqueueSnackbar } = useSnackbar();

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openResetPassword, setOpenResetPassword] = useState(false);

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
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  useEffect(() => {
    if (tenantId) {
      fetchUsers(tenantId);
    }
  }, [tenantId]);

  const fetchUsers = async (tenantId) => {
    setLoading(true);
    try {
      const data = await getUsersByTenantId(tenantId);
      setUsers(data);
    } catch (error) {
      console.error('Fetch Users Error:', error);
      enqueueSnackbar('Failed to fetch users.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

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
    setResetPasswordData({ userId: user.id, newPassword: '', confirmPassword: '' });
    setOpenResetPassword(true);
  };

  const handleCloseResetPassword = () => {
    setOpenResetPassword(false);
    setSelectedUser(null);
    setResetPasswordData({ userId: '', newPassword: '', confirmPassword: '' });
  };

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

  const handleCreateChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCreateFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleResetPasswordChange = (e) => {
    const { name, value } = e.target;
    setResetPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateRolesChange = (event) => {
    const { value } = event.target;
    setCreateFormData((prev) => ({ ...prev, roles: typeof value === 'string' ? value.split(',') : value }));
  };

  const handleEditRolesChange = (event) => {
    const { value } = event.target;
    setEditFormData((prev) => ({ ...prev, roles: typeof value === 'string' ? value.split(',') : value }));
  };

  const handleCreateSubmit = async () => {
    const { email, firstname, lastname, password, superAdmin, roles } = createFormData;
    if (!email || !firstname || !lastname || !password) {
      enqueueSnackbar('Please fill in all required fields.', { variant: 'warning' });
      return;
    }

    if (!tenantId) {
      enqueueSnackbar('Tenant ID is missing.', { variant: 'error' });
      return;
    }

    const userPayload = {
      email,
      firstname,
      lastname,
      password,
      superAdmin,
      roles,
      tenant: { tenantId },
    };

    try {
      await createUser(userPayload);
      enqueueSnackbar('User created successfully!', { variant: 'success' });
      handleCloseCreate();
      fetchUsers(tenantId);
    } catch (error) {
      console.error('Create User Error:', error);
      enqueueSnackbar('Failed to create user.', { variant: 'error' });
    }
  };

  const handleEditSubmit = async () => {
    const { id, email, firstname, lastname, password, superAdmin, roles, status } = editFormData;
    if (!email || !firstname || !lastname) {
      enqueueSnackbar('Please fill in all required fields.', { variant: 'warning' });
      return;
    }

    if (!tenantId) {
      enqueueSnackbar('Tenant ID is missing.', { variant: 'error' });
      return;
    }

    const userPayload = {
      email,
      firstname,
      lastname,
      superAdmin,
      roles,
      status,
      tenant: { tenantId },
    };
    if (password) {
      userPayload.password = password;
    }

    try {
      await updateUser(id, userPayload);
      enqueueSnackbar('User updated successfully!', { variant: 'success' });
      handleCloseEdit();
      fetchUsers(tenantId);
    } catch (error) {
      console.error('Edit User Error:', error);
      enqueueSnackbar('Failed to update user.', { variant: 'error' });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;
    try {
      await deleteUser(selectedUser.id);
      enqueueSnackbar('User deleted successfully!', { variant: 'success' });
      handleCloseDelete();
      fetchUsers(tenantId);
    } catch (error) {
      console.error('Delete User Error:', error);
      enqueueSnackbar('Failed to delete user.', { variant: 'error' });
    }
  };

  const handleResetPasswordSubmit = async () => {
    const { userId, newPassword, confirmPassword } = resetPasswordData;
    if (!newPassword || !confirmPassword) {
      enqueueSnackbar('Please fill in all password fields.', { variant: 'warning' });
      return;
    }
    if (newPassword !== confirmPassword) {
      enqueueSnackbar('Passwords do not match.', { variant: 'warning' });
      return;
    }

    setResetLoading(true);
    try {
      await changeUserPassword(userId, { newPassword, confirmPassword });
      enqueueSnackbar('Password reset successfully!', { variant: 'success' });
      handleCloseResetPassword();
      fetchUsers(tenantId);
    } catch (error) {
      console.error('Change Password Error:', error);
      enqueueSnackbar('Failed to reset password.', { variant: 'error' });
    } finally {
      setResetLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { 
      field: 'email', 
      headerName: 'Email', 
      width: 200,
      renderCell: (params) => (
        <Tooltip title="User Email">
          <Typography variant="body2" color="primary">
            {params.value}
          </Typography>
        </Tooltip>
      ),
    },
    { field: 'firstname', headerName: 'First Name', width: 130 },
    { field: 'lastname', headerName: 'Last Name', width: 130 },
    {
      field: 'superAdmin',
      headerName: 'Super Admin',
      width: 130,
      type: 'boolean',
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => <Checkbox checked={params.value} disabled />,
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
        <Typography 
          color={params.value === 'Active' ? 'green' : 'red'}
          variant="body2"
        >
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

  const rows = users.map((user) => ({
    id: user.id,
    email: user.email,
    firstname: user.firstname,
    lastname: user.lastname,
    superAdmin: user.superAdmin,
    roles: user.roles,
    status: user.status || 'Active',
  }));

  const getRowClassName = (params) => {
    if (params.row.status === 'Inactive') {
      return 'inactive-row';
    }
    return '';
  };

  return (
    <StyledPaper elevation={3}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Admin Panel</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate}>
          Create User
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
          pagination
          sortingOrder={['asc', 'desc']}
          disableSelectionOnClick={false}
          checkboxSelection
          autoHeight
          components={{ Toolbar: GridToolbar }}
          getRowClassName={getRowClassName}
          sx={{
            '& .inactive-row': { backgroundColor: '#ffe6e6' },
            '& .MuiDataGrid-row.selected': { backgroundColor: '#d0e7ff' },
            '& .MuiDataGrid-row:hover': { backgroundColor: '#f5f5f5' },
            '& .MuiDataGrid-columnHeader': { backgroundColor: '#e0e0e0' },
            '& .MuiDataGrid-footerContainer': { backgroundColor: '#e0e0e0' },
            '& .MuiDataGrid-cell': { outline: 'none' },
          }}
        />
      )}

      {/* Create User Dialog */}
      <Dialog open={openCreate} onClose={handleCloseCreate} fullWidth maxWidth="sm">
        <DialogTitle>Create New User</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}><TextField label="Email" name="email" variant="outlined" value={createFormData.email} onChange={handleCreateChange} required type="email" fullWidth /></Grid>
            <Grid item xs={6}><TextField label="First Name" name="firstname" variant="outlined" value={createFormData.firstname} onChange={handleCreateChange} required fullWidth /></Grid>
            <Grid item xs={6}><TextField label="Last Name" name="lastname" variant="outlined" value={createFormData.lastname} onChange={handleCreateChange} required fullWidth /></Grid>
            <Grid item xs={12}><TextField label="Password" name="password" variant="outlined" value={createFormData.password} onChange={handleCreateChange} required type="password" fullWidth /></Grid>
            <Grid item xs={12}>
              <FormControlLabel control={<Checkbox checked={createFormData.superAdmin} onChange={handleCreateChange} name="superAdmin" />} label="Super Admin" />
            </Grid>
            <Grid item xs={12}>
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
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreate} color="secondary" variant="outlined">Cancel</Button>
          <Button onClick={handleCreateSubmit} color="primary" variant="contained">Create</Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={openEdit} onClose={handleCloseEdit} fullWidth maxWidth="sm">
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}><TextField label="Email" name="email" variant="outlined" value={editFormData.email} onChange={handleEditChange} required type="email" fullWidth /></Grid>
            <Grid item xs={6}><TextField label="First Name" name="firstname" variant="outlined" value={editFormData.firstname} onChange={handleEditChange} required fullWidth /></Grid>
            <Grid item xs={6}><TextField label="Last Name" name="lastname" variant="outlined" value={editFormData.lastname} onChange={handleEditChange} required fullWidth /></Grid>
            <Grid item xs={12}><TextField label="Password" name="password" variant="outlined" value={editFormData.password} onChange={handleEditChange} type="password" helperText="Leave blank to keep existing password" fullWidth /></Grid>
            <Grid item xs={12}>
              <FormControlLabel control={<Checkbox checked={editFormData.superAdmin} onChange={handleEditChange} name="superAdmin" />} label="Super Admin" />
            </Grid>
            <Grid item xs={12}>
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
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="edit-status-label">Status</InputLabel>
                <Select labelId="edit-status-label" name="status" value={editFormData.status} onChange={handleEditChange} label="Status">
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit} color="secondary" variant="outlined">Cancel</Button>
          <Button onClick={handleEditSubmit} color="primary" variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={openResetPassword} onClose={handleCloseResetPassword} fullWidth maxWidth="sm">
        <DialogTitle>Reset Password for {selectedUser?.email}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="New Password"
                name="newPassword"
                variant="outlined"
                value={resetPasswordData.newPassword}
                onChange={handleResetPasswordChange}
                required
                type="password"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Confirm New Password"
                name="confirmPassword"
                variant="outlined"
                value={resetPasswordData.confirmPassword}
                onChange={handleResetPasswordChange}
                required
                type="password"
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseResetPassword} color="secondary" variant="outlined">Cancel</Button>
          <Button onClick={handleResetPasswordSubmit} color="primary" variant="contained" disabled={resetLoading}>
            {resetLoading ? <CircularProgress size={24} /> : 'Reset Password'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={Boolean(openDelete)} onClose={handleCloseDelete}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete user <strong>{selectedUser?.email}</strong>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete} color="secondary" variant="outlined">Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <style jsx>{`
        .inactive-row {
          background-color: #ffe6e6;
        }
      `}</style>
    </StyledPaper>
  );
};

export default AdminPanel;