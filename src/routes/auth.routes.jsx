import { Routes, Route } from 'react-router';

import { Home } from '../pages/Home';
import { Settings } from '../pages/Settings';
import { Words } from '../pages/Words';
import SubscriptionSuccess from '../pages/Subscription/success';
import SubscriptionCancelled from '../pages/Subscription/cancel';
import SubscriptionManagement from '../pages/SubscriptionManager';

export function AuthRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/words" element={<Words />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/subscription/success" element={<SubscriptionSuccess />} />
            <Route path="/subscription/cancel" element={<SubscriptionCancelled />} />
            <Route path="/subscription" element={<SubscriptionManagement />} />
        </Routes>
    );
}
