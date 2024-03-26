import { Routes, Route } from 'react-router';

import { SignUp } from '../pages/SignUp';
import { Login } from '../pages/Login';
import { Token } from '../pages/Token';

export function AppRoutes() {
    return (
        <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/token/:token" element={<Token />} />
            <Route path="/" element={<Login />} />
        </Routes>
    );
}
