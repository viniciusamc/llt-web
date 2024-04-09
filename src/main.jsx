import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { ThemeProvider } from 'styled-components';
import theme from './styles/theme.js';

import { AuthProvider } from './hooks/auth.jsx';
import { Routes } from './routes/index.jsx';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({})

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <AuthProvider>
                <QueryClientProvider client={queryClient}>
                    <Routes />
                </QueryClientProvider>
            </AuthProvider>
        </ThemeProvider>
    </React.StrictMode>,
);
