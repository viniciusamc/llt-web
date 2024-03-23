import { Routes, Route } from 'react-router';

import { Home } from '../pages/Home';

export function AuthRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
        </Routes>
    );
}
