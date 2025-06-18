// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme/theme';
import { AuthProvider } from './components/auth/AuthContext';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './styles/global.css'; // Import global styles
import CssBaseline from '@mui/material/CssBaseline';
import ErrorBoundary from '../src/roles/ErrorBoundary'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
            <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </ThemeProvider>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);