import { Routes, Route } from 'react-router';

import { SignUp } from '../pages/SignUp';
import { Login } from '../pages/Login';

export function AppRoutes() {
    return (
        <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/" element={<Login />} />
        </Routes>
    );
}
