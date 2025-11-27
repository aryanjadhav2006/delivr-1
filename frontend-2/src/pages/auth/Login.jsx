import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [isAdmin, setIsAdmin] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Bypass for Admin Testing
        if (isAdmin) {
            const adminUser = {
                _id: 'admin-1',
                name: 'Admin User',
                email: formData.email || 'admin@delivr.com',
                role: 'admin',
                token: 'mock-admin-token'
            };

            // Manually update auth context
            localStorage.setItem('token', adminUser.token);
            localStorage.setItem('user', JSON.stringify(adminUser));
            // We need to force a reload or use a method from context if available to update state
            // Since we can't easily access setToken/setUser from here without exposing them, 
            // we'll use window.location.href to force a reload which picks up localStorage
            // OR better, if we have a way to set user. 
            // The AuthContext exposes `updateUser` but that might not set token state fully if logic depends on it.
            // Actually, let's just use the exposed login function if we can, but it's hardcoded.
            // Let's manually set localStorage and force reload to /admin/dashboard

            window.location.href = '/admin/dashboard';
            return;
        }

        const result = await login(formData.email, formData.password);

        if (result.success) {
            // Redirect based on role
            switch (result.user.role) {
                case 'customer':
                    navigate('/home');
                    break;
                case 'delivery_partner':
                    navigate('/delivery/dashboard');
                    break;
                case 'admin':
                    navigate('/admin/dashboard');
                    break;
                default:
                    navigate('/');
            }
        } else {
            setError(result.message);
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <Link to="/" className="return-home-btn">
                ← Return to Home
            </Link>
            <div className="auth-container">
                <div className="auth-header">
                    <Link to="/" className="auth-logo">
                        DELIVR.
                    </Link>
                    <h2>Welcome Back</h2>
                    <p>Login to your account</p>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Enter your password"
                        />
                    </div>

                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input
                            type="checkbox"
                            id="isAdmin"
                            checked={isAdmin}
                            onChange={(e) => setIsAdmin(e.target.checked)}
                            style={{ width: 'auto' }}
                        />
                        <label htmlFor="isAdmin" style={{ margin: 0, cursor: 'pointer' }}>Login as Admin</label>
                    </div>

                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="test-credentials">
                    <h4>🔑 Test Accounts</h4>
                    <div className="credential-item">
                        <strong>Admin:</strong> See ADMIN_SETUP.md for creating admin account
                    </div>
                    <div className="credential-item">
                        <strong>Customer/Delivery:</strong> Register a new account
                    </div>
                </div>

                <div className="auth-footer">
                    <p>
                        Don't have an account? <Link to="/register">Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
