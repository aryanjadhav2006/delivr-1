import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LocationProvider } from './context/LocationContext';
import { ToastProvider } from './context/ToastContext';

// Pages
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Customer pages
import Home from './pages/customer/Home';
import RestaurantMenu from './pages/customer/RestaurantMenu';
import TrackOrder from './pages/customer/TrackOrder';
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';
import OrderHistory from './pages/customer/OrderHistory';
import Profile from './pages/customer/Profile';
import Favorites from './pages/customer/Favorites';
import Settings from './pages/customer/Settings';
import Support from './pages/customer/Support';
import Chatbot from './pages/customer/Chatbot';

// Delivery Partner pages
import DeliveryDashboard from './pages/delivery/Dashboard';
import AvailableOrders from './pages/delivery/AvailableOrders';
import AssignedOrders from './pages/delivery/AssignedOrders';
import Earnings from './pages/delivery/Earnings';
import DeliveryProfile from './pages/delivery/Profile';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import OrderManagement from './pages/admin/OrderManagement';
import DeliveryPartners from './pages/admin/DeliveryPartners';
import RestaurantManagement from './pages/admin/RestaurantManagement';
import Coupons from './pages/admin/Coupons';
import Complaints from './pages/admin/Complaints';
import Analytics from './pages/admin/Analytics';

import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" />;
    }

    return children;
};

// Role-based redirect
const RoleBasedRedirect = () => {
    const { user } = useAuth();

    if (!user) {
        return <Landing />;
    }

    switch (user.role) {
        case 'customer':
            return <Navigate to="/home" />;
        case 'delivery_partner':
            return <Navigate to="/delivery/dashboard" />;
        case 'admin':
            return <Navigate to="/admin/dashboard" />;
        default:
            return <Navigate to="/login" />;
    }
};

function App() {
    return (
        <ToastProvider>
            <AuthProvider>
                <CartProvider>
                    <LocationProvider>
                        <Router>
                            <Routes>
                                {/* Public routes */}
                                <Route path="/" element={<RoleBasedRedirect />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />

                                {/* Customer routes */}
                                <Route
                                    path="/home"
                                    element={
                                        <ProtectedRoute allowedRoles={['customer']}>
                                            <Home />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/restaurant/:id"
                                    element={
                                        <ProtectedRoute allowedRoles={['customer']}>
                                            <RestaurantMenu />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/track-order"
                                    element={
                                        <ProtectedRoute allowedRoles={['customer']}>
                                            <TrackOrder />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/cart"
                                    element={
                                        <ProtectedRoute allowedRoles={['customer']}>
                                            <Cart />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/checkout"
                                    element={
                                        <ProtectedRoute allowedRoles={['customer']}>
                                            <Checkout />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/orders"
                                    element={
                                        <ProtectedRoute allowedRoles={['customer']}>
                                            <OrderHistory />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/profile"
                                    element={
                                        <ProtectedRoute allowedRoles={['customer']}>
                                            <Profile />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/favorites"
                                    element={
                                        <ProtectedRoute allowedRoles={['customer']}>
                                            <Favorites />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/settings"
                                    element={
                                        <ProtectedRoute allowedRoles={['customer', 'delivery_partner', 'admin']}>
                                            <Settings />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/support"
                                    element={
                                        <ProtectedRoute allowedRoles={['customer']}>
                                            <Support />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/chatbot"
                                    element={
                                        <ProtectedRoute allowedRoles={['customer']}>
                                            <Chatbot />
                                        </ProtectedRoute>
                                    }
                                />

                                {/* Delivery Partner routes */}
                                <Route
                                    path="/delivery/dashboard"
                                    element={
                                        <ProtectedRoute allowedRoles={['delivery_partner']}>
                                            <DeliveryDashboard />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/delivery/available-orders"
                                    element={
                                        <ProtectedRoute allowedRoles={['delivery_partner']}>
                                            <AvailableOrders />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/delivery/assigned-orders"
                                    element={
                                        <ProtectedRoute allowedRoles={['delivery_partner']}>
                                            <AssignedOrders />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/delivery/earnings"
                                    element={
                                        <ProtectedRoute allowedRoles={['delivery_partner']}>
                                            <Earnings />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/delivery/profile"
                                    element={
                                        <ProtectedRoute allowedRoles={['delivery_partner']}>
                                            <DeliveryProfile />
                                        </ProtectedRoute>
                                    }
                                />

                                {/* Admin routes */}
                                <Route
                                    path="/admin/dashboard"
                                    element={
                                        <ProtectedRoute allowedRoles={['admin']}>
                                            <AdminDashboard />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/admin/orders"
                                    element={
                                        <ProtectedRoute allowedRoles={['admin']}>
                                            <OrderManagement />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/admin/delivery-partners"
                                    element={
                                        <ProtectedRoute allowedRoles={['admin']}>
                                            <DeliveryPartners />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/admin/restaurants"
                                    element={
                                        <ProtectedRoute allowedRoles={['admin']}>
                                            <RestaurantManagement />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/admin/coupons"
                                    element={
                                        <ProtectedRoute allowedRoles={['admin']}>
                                            <Coupons />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/admin/complaints"
                                    element={
                                        <ProtectedRoute allowedRoles={['admin']}>
                                            <Complaints />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/admin/analytics"
                                    element={
                                        <ProtectedRoute allowedRoles={['admin']}>
                                            <Analytics />
                                        </ProtectedRoute>
                                    }
                                />

                                {/* 404 */}
                                <Route path="*" element={<div>404 - Page Not Found</div>} />
                            </Routes>
                        </Router>
                    </LocationProvider>
                </CartProvider>
            </AuthProvider>
        </ToastProvider>
    );
}

export default App;
