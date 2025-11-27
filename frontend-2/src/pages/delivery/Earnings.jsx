import { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { FaMoneyBillWave, FaCoins, FaChartLine } from 'react-icons/fa';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import './Earnings.css';

const Earnings = () => {
    const [timeFilter, setTimeFilter] = useState('total');
    const [avgFilter, setAvgFilter] = useState('daily');
    const [graphFilter, setGraphFilter] = useState('week');

    // Mock Data (Initial State - 0)
    const earningsData = {
        total: { amount: 0, tips: 0 },
        week: { amount: 0, tips: 0 },
        month: { amount: 0, tips: 0 },
        year: { amount: 0, tips: 0 }
    };

    const avgData = {
        daily: 0,
        weekly: 0,
        monthly: 0,
        yearly: 0
    };

    // Empty Graph Data Sets
    const graphDataSets = {
        week: [
            { date: 'Mon', amount: 0 },
            { date: 'Tue', amount: 0 },
            { date: 'Wed', amount: 0 },
            { date: 'Thu', amount: 0 },
            { date: 'Fri', amount: 0 },
            { date: 'Sat', amount: 0 },
            { date: 'Sun', amount: 0 },
        ],
        month: [
            { date: 'Week 1', amount: 0 },
            { date: 'Week 2', amount: 0 },
            { date: 'Week 3', amount: 0 },
            { date: 'Week 4', amount: 0 },
        ],
        year: [
            { date: 'Jan', amount: 0 },
            { date: 'Feb', amount: 0 },
            { date: 'Mar', amount: 0 },
            { date: 'Apr', amount: 0 },
            { date: 'May', amount: 0 },
            { date: 'Jun', amount: 0 },
            { date: 'Jul', amount: 0 },
            { date: 'Aug', amount: 0 },
            { date: 'Sep', amount: 0 },
            { date: 'Oct', amount: 0 },
            { date: 'Nov', amount: 0 },
            { date: 'Dec', amount: 0 },
        ]
    };

    const currentData = earningsData[timeFilter];
    const currentGraphData = graphDataSets[graphFilter];

    return (
        <div className="earnings-page">
            <Navbar />

            <div className="container">
                <div className="earnings-header">
                    <h1>Your Earnings</h1>
                    <p>Track your income and tips</p>
                </div>

                <div className="earnings-controls">
                    <select
                        className="time-filter"
                        value={timeFilter}
                        onChange={(e) => setTimeFilter(e.target.value)}
                    >
                        <option value="total">Total Earnings</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="year">This Year</option>
                    </select>
                </div>

                <div className="earnings-grid">
                    {/* Total Earnings Card */}
                    <div className="earnings-card">
                        <div className="card-icon">
                            <FaMoneyBillWave />
                        </div>
                        <h2 className="card-title">Earnings</h2>
                        <div className="card-amount">₹{currentData.amount}</div>
                        <div className="card-subtitle">
                            {timeFilter === 'total' ? 'Lifetime Earnings' : `Earnings for this ${timeFilter}`}
                        </div>
                    </div>

                    {/* Tips Card */}
                    <div className="earnings-card">
                        <div className="card-icon">
                            <FaCoins />
                        </div>
                        <h2 className="card-title">Tips</h2>
                        <div className="card-amount">₹{currentData.tips}</div>
                        <div className="card-subtitle">
                            Extra love from customers
                        </div>
                    </div>

                    {/* Average Earnings Card */}
                    <div className="earnings-card avg-earnings-card" style={{ gridColumn: '1 / -1' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div className="card-icon">
                                <FaChartLine />
                            </div>
                            <h2 className="card-title">Average Earnings</h2>
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <div className="card-amount">₹{avgData[avgFilter]}</div>
                            <div className="card-subtitle">
                                Average per {avgFilter === 'daily' ? 'Day' : avgFilter === 'weekly' ? 'Week' : avgFilter === 'monthly' ? 'Month' : 'Year'}
                            </div>
                        </div>

                        <div className="earnings-controls" style={{ margin: 0 }}>
                            <select
                                className="time-filter"
                                value={avgFilter}
                                onChange={(e) => setAvgFilter(e.target.value)}
                            >
                                <option value="daily">Daily Avg</option>
                                <option value="weekly">Weekly Avg</option>
                                <option value="monthly">Monthly Avg</option>
                                <option value="yearly">Yearly Avg</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Earnings Graph Section */}
                <div className="earnings-chart-section">
                    <div className="section-header">
                        <h2>Earnings History</h2>
                        <select
                            className="time-filter"
                            value={graphFilter}
                            onChange={(e) => setGraphFilter(e.target.value)}
                        >
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                            <option value="year">This Year</option>
                        </select>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={currentGraphData}>
                                <defs>
                                    <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#800020" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#800020" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="date" />
                                <YAxis />
                                <CartesianGrid strokeDasharray="3 3" />
                                <Tooltip />
                                <Area
                                    type="monotone"
                                    dataKey="amount"
                                    stroke="#800020"
                                    fillOpacity={1}
                                    fill="url(#colorEarnings)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Earnings;
