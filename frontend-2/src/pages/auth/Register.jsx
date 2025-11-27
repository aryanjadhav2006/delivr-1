import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'customer',
        vehicleType: 'bike',
        vehicleNumber: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await register(formData);

        if (result.success) {
            // Redirect based on role
            switch (result.user.role) {
                case 'customer':
                    navigate('/home');
                    break;
                case 'delivery_partner':
                    navigate('/delivery/dashboard');
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
                    <h2>Create Account</h2>
                    <p>Join Delivr today</p>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Register as</label>
                        <div className="role-buttons">
                            <button
                                type="button"
                                className={`role-btn ${formData.role === 'customer' ? 'active' : ''}`}
                                onClick={() => setFormData({ ...formData, role: 'customer' })}
                            >
                                Customer
                            </button>
                            <button
                                type="button"
                                className={`role-btn ${formData.role === 'delivery_partner' ? 'active' : ''
                                    }`}
                                onClick={() => setFormData({ ...formData, role: 'delivery_partner' })}
                            >
                                Delivery Partner
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter your name"
                        />
                    </div>

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
                            minLength="6"
                            placeholder="At least 6 characters"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            placeholder="Enter your phone number"
                        />
                    </div>

                    {formData.role === 'delivery_partner' && (
                        <>
                            <div className="form-group">
                                <label htmlFor="vehicleType">Vehicle Type</label>
                                <select
                                    id="vehicleType"
                                    name="vehicleType"
                                    value={formData.vehicleType}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="bike">Bike</option>
                                    <option value="scooter">Scooter</option>
                                    <option value="bicycle">Bicycle</option>
                                    <option value="car">Car</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="vehicleNumber">Vehicle Number</label>
                                <input
                                    type="text"
                                    id="vehicleNumber"
                                    name="vehicleNumber"
                                    value={formData.vehicleNumber}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter vehicle number"
                                />
                            </div>
                        </>
                    )}

                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Already have an account? <Link to="/login">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
