import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Nav from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import api from '../../utils/api';
import { FaClock, FaCheck, FaTimes } from 'react-icons/fa';
import './OrderHistory.css';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/orders');
            setOrders(response.data.data || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'delivered':
                return 'status-delivered';
            case 'cancelled':
                return 'status-cancelled';
            case 'pending':
            case 'confirmed':
                return 'status-pending';
            default:
                return 'status-progress';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'delivered':
                return <FaCheck />;
            case 'cancelled':
                return <FaTimes />;
            default:
                return <FaClock />;
        }
    };

    return (
        <div className="order-history-page">
            <Nav />

            <div className="container" style={{ padding: '40px 20px' }}>
                <h1>Order History</h1>

                {loading ? (
                    <div className="loading">Loading orders...</div>
                ) : orders.length > 0 ? (
                    <div className="orders-list">
                        {orders.map((order) => (
                            <div key={order._id} className="order-card">
                                <div className="order-header">
                                    <div>
                                        <h3>{order.restaurantId?.name || 'Restaurant'}</h3>
                                        <p className="order-id">Order #{order.orderId}</p>
                                    </div>
                                    <div className={`order-status ${getStatusColor(order.status)}`}>
                                        {getStatusIcon(order.status)}
                                        <span>{order.status}</span>
                                    </div>
                                </div>

                                <div className="order-items">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="order-item">
                                            <span>
                                                {item.name} × {item.quantity}
                                            </span>
                                            <span>₹{item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="order-footer">
                                    <div className="order-total">
                                        <strong>Total:</strong> ₹{order.totalAmount}
                                    </div>
                                    <div className="order-date">
                                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </div>
                                </div>

                                <div className="order-actions">
                                    {order.status === 'delivered' && (
                                        <Link to={`/restaurant/${order.restaurantId?._id}`} className="btn btn-outline">
                                            Reorder
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-orders">
                        <p>No orders yet</p>
                        <Link to="/home" className="btn btn-primary">
                            Start Ordering
                        </Link>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default OrderHistory;
