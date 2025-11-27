import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useCart } from '../../context/CartContext';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import './Cart.css';

const Cart = () => {
    const navigate = useNavigate();
    const { cartItems, restaurant, updateQuantity, removeFromCart, clearCart, getCartTotal } =
        useCart();

    if (cartItems.length === 0) {
        return (
            <div className="cart-page">
                <Navbar />
                <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
                    <h1>Your Cart is Empty</h1>
                    <p style={{ marginBottom: '20px', color: '#666' }}>
                        Add items from restaurants to see them here
                    </p>
                    <button className="btn btn-primary" onClick={() => navigate('/home')}>
                        Browse Restaurants
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    const deliveryFee = 40;
    const taxes = getCartTotal() * 0.05; // 5% tax
    const totalAmount = getCartTotal() + deliveryFee + taxes;

    return (
        <div className="cart-page">
            <Navbar />

            <div className="container" style={{ padding: '40px 20px' }}>
                <h1>Cart</h1>

                <div className="cart-container">
                    {/* Cart Items */}
                    <div className="cart-items-section">
                        <div className="restaurant-info">
                            <h2>{restaurant?.name}</h2>
                            <p>
                                {restaurant?.area}, {restaurant?.city}
                            </p>
                        </div>

                        <div className="cart-items">
                            {cartItems.map((item) => (
                                <div key={item._id} className="cart-item">
                                    <div className="item-details">
                                        <h3>{item.name}</h3>
                                        <p className="item-price">₹{item.price}</p>
                                    </div>

                                    <div className="item-controls">
                                        <div className="quantity-controls">
                                            <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>
                                                <FaMinus />
                                            </button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>
                                                <FaPlus />
                                            </button>
                                        </div>

                                        <button
                                            className="btn-remove"
                                            onClick={() => removeFromCart(item._id)}
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>

                                    <div className="item-total">₹{item.price * item.quantity}</div>
                                </div>
                            ))}
                        </div>

                        <button className="btn-clear" onClick={clearCart}>
                            Clear Cart
                        </button>
                    </div>

                    {/* Bill Summary */}
                    <div className="bill-summary">
                        <h3>Bill Summary</h3>

                        <div className="bill-item">
                            <span>Item Total</span>
                            <span>₹{getCartTotal()}</span>
                        </div>

                        <div className="bill-item">
                            <span>Delivery Fee</span>
                            <span>₹{deliveryFee}</span>
                        </div>

                        <div className="bill-item">
                            <span>Taxes (5%)</span>
                            <span>₹{taxes.toFixed(2)}</span>
                        </div>

                        <div className="bill-item total">
                            <span>Total Amount</span>
                            <span>₹{totalAmount.toFixed(2)}</span>
                        </div>

                        <button className="btn btn-primary" onClick={() => navigate('/checkout')}>
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Cart;
