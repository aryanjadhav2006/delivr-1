import { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { FaPhone, FaMotorcycle, FaCheckCircle, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import './TrackOrder.css';

const TrackOrder = () => {
    // Mock data for the order tracking
    const [orderStatus, setOrderStatus] = useState(null); // No status initially

    const steps = [
        { id: 'confirmed', label: 'Order Confirmed', time: '', completed: false },
        { id: 'preparing', label: 'Preparing', time: '', completed: false },
        { id: 'out_for_delivery', label: 'Out for Delivery', time: '', completed: false },
        { id: 'delivered', label: 'Delivered', time: '', completed: false },
    ];

    const deliveryPartner = null; // No partner assigned yet

    return (
        <div className="track-order-page">
            <Navbar />

            <div className="container track-order-container">
                <h1 className="page-title">Track Your Order</h1>

                <div className="track-order-grid">
                    {/* Left Column: Map & Status */}
                    <div className="tracking-main">
                        {/* Map Placeholder */}
                        <div className="map-placeholder">
                            <div className="map-bg">
                                <div className="map-pattern"></div>
                                <div className="map-marker restaurant-marker">
                                    <FaMapMarkerAlt />
                                    <span>Restaurant</span>
                                </div>
                                <div className="map-marker user-marker">
                                    <FaMapMarkerAlt />
                                    <span>You</span>
                                </div>
                                <div className="map-route">
                                    {/* Route hidden until active */}
                                </div>
                            </div>
                            <div className="map-overlay">
                                <p>Live Tracking Map</p>
                            </div>
                        </div>

                        {/* Order Status Timeline */}
                        <div className="order-timeline-card">
                            <h2>Order Status</h2>
                            <div className="timeline">
                                {steps.map((step, index) => (
                                    <div key={step.id} className={`timeline-step ${step.completed ? 'completed' : ''} ${step.id === orderStatus ? 'active' : ''}`}>
                                        <div className="step-icon">
                                            {step.completed ? <FaCheckCircle /> : <div className="circle"></div>}
                                        </div>
                                        <div className="step-content">
                                            <h3>{step.label}</h3>
                                            {step.time && <span className="step-time">{step.time}</span>}
                                        </div>
                                        {index < steps.length - 1 && <div className="step-line"></div>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Delivery Partner & Order Details */}
                    <div className="tracking-sidebar">
                        {/* Delivery Partner Card */}
                        <div className="partner-card">
                            <h2>Delivery Partner</h2>
                            {deliveryPartner ? (
                                <div className="partner-info">
                                    <div className="partner-img">
                                        <img src={deliveryPartner.image} alt={deliveryPartner.name} />
                                    </div>
                                    <div className="partner-details">
                                        <h3>{deliveryPartner.name}</h3>
                                        <p className="partner-vehicle">
                                            <FaMotorcycle /> {deliveryPartner.vehicle}
                                        </p>
                                        <div className="partner-rating">
                                            <span>★ {deliveryPartner.rating}</span>
                                        </div>
                                    </div>
                                    <button className="btn btn-primary btn-call">
                                        <FaPhone /> Call Partner
                                    </button>
                                </div>
                            ) : (
                                <div className="no-partner">
                                    <p>Delivery partner will be assigned soon.</p>
                                </div>
                            )}
                        </div>

                        {/* Order Summary (Brief) */}
                        <div className="order-summary-card">
                            <h2>Order Details</h2>
                            <div className="summary-item">
                                <span>Order ID</span>
                                <strong>--</strong>
                            </div>
                            <div className="summary-item">
                                <span>Estimated Arrival</span>
                                <strong>-- Mins</strong>
                            </div>
                            <div className="summary-item">
                                <span>Payment Method</span>
                                <strong>--</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default TrackOrder;
