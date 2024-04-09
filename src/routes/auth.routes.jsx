import { Routes, Route } from 'react-router';

import { Home } from '../pages/Home';
import { Settings } from '../pages/Settings';

export function AuthRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/settings" element={<Settings />} />
        </Routes>
    );
}
