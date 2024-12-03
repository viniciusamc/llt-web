import { Routes, Route } from 'react-router';

import { SignUp } from '../pages/SignUp';
import { Login } from '../pages/Login';
import { Token } from '../pages/Token';
import LandingPage from '../App';

export function AppRoutes() {
    return (
        <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/token/:token" element={<Token />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<LandingPage />} />
        </Routes>
    );
}
