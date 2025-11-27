import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import api from '../../utils/api';
import './Profile.css';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
    });
    const [editing, setEditing] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');

    const handleSave = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await api.put('/auth/profile', formData);
            if (response.data.success) {
                updateUser(response.data.data);
                setSaved(true);
                setEditing(false);
                setTimeout(() => setSaved(false), 3000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        }
    };

    const handleCancel = () => {
        setFormData({
            name: user?.name || '',
            email: user?.email || '',
            phone: user?.phone || '',
        });
        setEditing(false);
        setError('');
    };

    return (
        <div className="profile-page">
            <Navbar />

            <div className="container" style={{ padding: '40px 20px' }}>
                <h1>Profile</h1>

                {saved && <div className="success-message">Profile updated successfully!</div>}
                {error && <div className="error-message">{error}</div>}

                <div className="profile-container">
                    <div className="profile-card">
                        <div className="profile-header">
                            <div className="profile-avatar">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h2>{user?.name}</h2>
                                <p className="profile-role">{user?.role}</p>
                            </div>
                        </div>

                        <form onSubmit={handleSave} className="profile-form">
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    disabled={!editing}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    disabled
                                    style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
                                />
                                <small>Email cannot be changed</small>
                            </div>

                            <div className="form-group">
                                <label>Phone Number</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    disabled={!editing}
                                    required
                                />
                            </div>

                            <div className="profile-actions">
                                {editing ? (
                                    <>
                                        <button type="submit" className="btn btn-primary">
                                            Save Changes
                                        </button>
                                        <button type="button" className="btn btn-outline" onClick={handleCancel}>
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => setEditing(true)}
                                    >
                                        Edit Profile
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    <div className="profile-stats">
                        <div className="stat-card">
                            <div className="stat-value">0</div>
                            <div className="stat-label">Total Orders</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">0</div>
                            <div className="stat-label">Favorites</div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Profile;
