import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { ThemeProvider } from 'styled-components';
import theme from './styles/theme.js';

import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';

import { AuthProvider } from './hooks/auth.jsx';
import { Routes } from './routes/index.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <AuthProvider>
                <SpeedInsights />
                <Analytics />
                <Routes />
            </AuthProvider>
        </ThemeProvider>
    </React.StrictMode>,
);
