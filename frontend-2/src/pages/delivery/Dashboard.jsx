import { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend
} from 'recharts';
import './Dashboard.css';

const Dashboard = () => {
    const [deliveryView, setDeliveryView] = useState('today');

    // Mock Data (Initial State)
    const stats = {
        earnings: 0,
        todayDeliveries: 0,
        totalDeliveries: 0
    };

    const earningsData = [
        { name: 'Mon', earnings: 0, deliveries: 0 },
        { name: 'Tue', earnings: 0, deliveries: 0 },
        { name: 'Wed', earnings: 0, deliveries: 0 },
        { name: 'Thu', earnings: 0, deliveries: 0 },
        { name: 'Fri', earnings: 0, deliveries: 0 },
        { name: 'Sat', earnings: 0, deliveries: 0 },
        { name: 'Sun', earnings: 0, deliveries: 0 },
    ];

    const timeData = [
        { time: '10 AM', orders: 0 },
        { time: '12 PM', orders: 0 },
        { time: '2 PM', orders: 0 },
        { time: '4 PM', orders: 0 },
        { time: '6 PM', orders: 0 },
        { time: '8 PM', orders: 0 },
        { time: '10 PM', orders: 0 },
    ];

    return (
        <div className="delivery-dashboard">
            <Navbar />

            <div className="container">
                <div className="dashboard-header">
                    <h1>Partner Dashboard</h1>
                    <p>Welcome back, Partner!</p>
                </div>

                <div className="dashboard-grid">
                    {/* Earnings Card */}
                    <div className="dashboard-card">
                        <div className="card-header">
                            <h2>Today's Earnings</h2>
                        </div>
                        <div className="stat-value">₹{stats.earnings}</div>
                        <div className="stat-label">Keep it up!</div>
                    </div>

                    {/* Deliveries Card with Toggle */}
                    <div className="dashboard-card">
                        <div className="card-header">
                            <h2>Deliveries</h2>
                            <select
                                className="toggle-select"
                                value={deliveryView}
                                onChange={(e) => setDeliveryView(e.target.value)}
                            >
                                <option value="today">Today</option>
                                <option value="total">Total</option>
                            </select>
                        </div>
                        <div className="stat-value">
                            {deliveryView === 'today' ? stats.todayDeliveries : stats.totalDeliveries}
                        </div>
                        <div className="stat-label">
                            {deliveryView === 'today' ? 'Orders Delivered Today' : 'Lifetime Deliveries'}
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="dashboard-grid">
                    <div className="dashboard-card">
                        <div className="card-header">
                            <h2>Earnings vs Deliveries</h2>
                        </div>
                        <div className="chart-container">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={earningsData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis yAxisId="left" orientation="left" stroke="#800020" />
                                    <YAxis yAxisId="right" orientation="right" stroke="#333" />
                                    <Tooltip />
                                    <Legend />
                                    <Bar yAxisId="left" dataKey="earnings" fill="#800020" name="Earnings (₹)" />
                                    <Bar yAxisId="right" dataKey="deliveries" fill="#333" name="Deliveries" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="dashboard-card">
                        <div className="card-header">
                            <h2>Orders by Time</h2>
                        </div>
                        <div className="chart-container">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={timeData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="time" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="orders" stroke="#800020" strokeWidth={3} dot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Dashboard;
