import { Routes, Route } from 'react-router';

import { Home } from '../pages/Home';
import { Settings } from '../pages/Settings';
import { Words } from '../pages/Words';

export function AuthRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/words" element={<Words />} />
            <Route path="/settings" element={<Settings />} />
        </Routes>
    );
}
