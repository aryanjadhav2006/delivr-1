import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import './Checkout.css';

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, restaurant, getCartTotal, clearCart } = useCart();
    const { user } = useAuth();

    const [deliveryAddress, setDeliveryAddress] = useState({
        street: '',
        city: '',
        state: '',
        pincode: '',
    });
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (cartItems.length === 0) {
        navigate('/home');
        return null;
    }

    const deliveryFee = 40;
    const taxes = getCartTotal() * 0.05;
    const totalAmount = getCartTotal() + deliveryFee + taxes;

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const orderData = {
                restaurantId: restaurant._id,
                items: cartItems.map((item) => ({
                    menuItemId: item._id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                })),
                totalAmount: totalAmount,
                deliveryFee: deliveryFee,
                taxes: taxes,
                deliveryAddress: deliveryAddress,
                paymentMethod: paymentMethod,
            };

            const response = await api.post('/orders', orderData);

            if (response.data.success) {
                clearCart();
                navigate('/orders');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="checkout-page">
            <Navbar />

            <div className="container" style={{ padding: '40px 20px' }}>
                <h1>Checkout</h1>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handlePlaceOrder} className="checkout-form">
                    <div className="checkout-container">
                        {/* Delivery Address */}
                        <div className="form-section">
                            <h2>Delivery Address</h2>

                            <div className="form-group">
                                <label>Street Address</label>
                                <input
                                    type="text"
                                    value={deliveryAddress.street}
                                    onChange={(e) =>
                                        setDeliveryAddress({ ...deliveryAddress, street: e.target.value })
                                    }
                                    required
                                    placeholder="House/Flat No., Street Name"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>City</label>
                                    <input
                                        type="text"
                                        value={deliveryAddress.city}
                                        onChange={(e) =>
                                            setDeliveryAddress({ ...deliveryAddress, city: e.target.value })
                                        }
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>State</label>
                                    <input
                                        type="text"
                                        value={deliveryAddress.state}
                                        onChange={(e) =>
                                            setDeliveryAddress({ ...deliveryAddress, state: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Pincode</label>
                                <input
                                    type="text"
                                    value={deliveryAddress.pincode}
                                    onChange={(e) =>
                                        setDeliveryAddress({ ...deliveryAddress, pincode: e.target.value })
                                    }
                                    required
                                    pattern="[0-9]{6}"
                                    placeholder="6-digit pincode"
                                />
                            </div>

                            {/* Payment Method */}
                            <h2 style={{ marginTop: '32px' }}>Payment Method</h2>

                            <div className="payment-methods">
                                <label className="payment-option">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="cod"
                                        checked={paymentMethod === 'cod'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    <div>
                                        <strong>Cash on Delivery</strong>
                                        <p>Pay when your order arrives</p>
                                    </div>
                                </label>

                                <label className="payment-option">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="online"
                                        checked={paymentMethod === 'online'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    <div>
                                        <strong>Online Payment</strong>
                                        <p>UPI, Cards, Net Banking</p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="order-summary">
                            <h2>Order Summary</h2>

                            <div className="summary-restaurant">
                                <h3>{restaurant?.name}</h3>
                                <p>
                                    {restaurant?.area}, {restaurant?.city}
                                </p>
                            </div>

                            <div className="summary-items">
                                {cartItems.map((item) => (
                                    <div key={item._id} className="summary-item">
                                        <span>
                                            {item.name} × {item.quantity}
                                        </span>
                                        <span>₹{item.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="summary-breakdown">
                                <div className="summary-row">
                                    <span>Item Total</span>
                                    <span>₹{getCartTotal()}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Delivery Fee</span>
                                    <span>₹{deliveryFee}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Taxes</span>
                                    <span>₹{taxes.toFixed(2)}</span>
                                </div>
                                <div className="summary-row total">
                                    <span>Total</span>
                                    <span>₹{totalAmount.toFixed(2)}</span>
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Placing Order...' : 'Place Order'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <Footer />
        </div>
    );
};

export default Checkout;
