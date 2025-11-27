import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { FaUsers, FaStore, FaMotorcycle, FaChartLine } from 'react-icons/fa';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import './Dashboard.css';

const AdminDashboard = () => {
    // Mock Data (Initial State - 0)
    const stats = {
        users: 0,
        restaurants: 0,
        partners: 0,
        traffic: 0
    };

    const salesData = {
        daily: 0,
        monthly: 0,
        yearly: 0
    };

    const salesGraphData = [
        { name: 'Jan', sales: 0 },
        { name: 'Feb', sales: 0 },
        { name: 'Mar', sales: 0 },
        { name: 'Apr', sales: 0 },
        { name: 'May', sales: 0 },
        { name: 'Jun', sales: 0 },
    ];

    const restaurants = [
        // Empty list for now
    ];

    return (
        <div className="admin-dashboard">
            <Navbar />

            <div className="container">
                <div className="admin-header">
                    <h1>Admin Dashboard</h1>
                    <p>Overview of platform performance</p>
                </div>

                {/* Key Stats Grid */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon"><FaUsers /></div>
                        <h3 className="stat-title">Users</h3>
                        <div className="stat-number">{stats.users}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon"><FaStore /></div>
                        <h3 className="stat-title">Restaurants</h3>
                        <div className="stat-number">{stats.restaurants}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon"><FaMotorcycle /></div>
                        <h3 className="stat-title">Partners</h3>
                        <div className="stat-number">{stats.partners}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon"><FaChartLine /></div>
                        <h3 className="stat-title">Traffic</h3>
                        <div className="stat-number">{stats.traffic}</div>
                    </div>
                </div>

                {/* Sales Section */}
                <div className="sales-section">
                    <h2 className="section-title">Sales Overview</h2>
                    <div className="sales-grid">
                        <div className="sales-card">
                            <div className="sales-label">Daily Sales</div>
                            <div className="sales-amount">₹{salesData.daily}</div>
                        </div>
                        <div className="sales-card">
                            <div className="sales-label">Monthly Sales</div>
                            <div className="sales-amount">₹{salesData.monthly}</div>
                        </div>
                        <div className="sales-card">
                            <div className="sales-label">Yearly Sales</div>
                            <div className="sales-amount">₹{salesData.yearly}</div>
                        </div>
                    </div>

                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={salesGraphData}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#800020" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#800020" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <CartesianGrid strokeDasharray="3 3" />
                                <Tooltip />
                                <Area
                                    type="monotone"
                                    dataKey="sales"
                                    stroke="#800020"
                                    fillOpacity={1}
                                    fill="url(#colorSales)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Restaurant List */}
                <div className="table-container">
                    <h2 className="section-title">Registered Restaurants</h2>
                    <table className="retro-table">
                        <thead>
                            <tr>
                                <th>Restaurant ID</th>
                                <th>Name</th>
                                <th>Status</th>
                                <th>Rating</th>
                            </tr>
                        </thead>
                        <tbody>
                            {restaurants.length > 0 ? (
                                restaurants.map((rest) => (
                                    <tr key={rest.id}>
                                        <td>{rest.id}</td>
                                        <td>{rest.name}</td>
                                        <td>{rest.status}</td>
                                        <td>{rest.rating}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', color: '#666' }}>
                                        No restaurants found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default AdminDashboard;
