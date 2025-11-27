import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import './Settings.css';

const Settings = () => {
    const { user, updateUser } = useAuth();
    const [settings, setSettings] = useState({
        notifications: user?.settings?.notifications ?? true,
        language: user?.settings?.language || 'en',
    });
    const [saved, setSaved] = useState(false);

    const handleSave = async () => {
        try {
            // Update settings (you can add API call here)
            updateUser({
                ...user,
                settings,
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    };

    return (
        <div className="settings-page">
            <Navbar />

            <div className="container" style={{ padding: '40px 20px' }}>
                <h1>Settings</h1>

                <div className="settings-container">
                    <div className="settings-section">
                        <h2>Notifications</h2>
                        <div className="setting-item">
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={settings.notifications}
                                    onChange={(e) =>
                                        setSettings({ ...settings, notifications: e.target.checked })
                                    }
                                />
                                <span className="slider"></span>
                            </label>
                            <div className="setting-info">
                                <h3>Push Notifications</h3>
                                <p>Receive notifications about order updates and offers</p>
                            </div>
                        </div>
                    </div>

                    <div className="settings-section">
                        <h2>Language</h2>
                        <select
                            value={settings.language}
                            onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                            className="language-select"
                        >
                            <option value="en">English</option>
                            <option value="hi">Hindi</option>
                            <option value="ta">Tamil</option>
                            <option value="te">Telugu</option>
                        </select>
                    </div>

                    <div className="settings-section">
                        <h2>Account</h2>
                        <div className="account-info">
                            <p>
                                <strong>Name:</strong> {user?.name}
                            </p>
                            <p>
                                <strong>Email:</strong> {user?.email}
                            </p>
                            <p>
                                <strong>Role:</strong> {user?.role}
                            </p>
                        </div>
                    </div>

                    <div className="settings-actions">
                        <button onClick={handleSave} className="btn btn-primary">
                            Save Settings
                        </button>
                        {saved && <span className="save-message">Settings saved!</span>}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Settings;
