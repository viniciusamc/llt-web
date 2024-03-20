import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { ThemeProvider } from 'styled-components'
import theme from './styles/theme.js'
import { Home } from './pages/Home/index.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <Home />
        </ThemeProvider>
    </React.StrictMode>
)
