import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { FaShoppingCart, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { GiChefToque } from 'react-icons/gi';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { getItemCount } = useCart();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="container navbar-content">
                <Link to="/" className="navbar-brand">
                    DELIVR.
                </Link>

                <ul className="navbar-menu">
                    {user && user.role === 'customer' && (
                        <>
                            <li>
                                <Link to="/home" className="navbar-link">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/track-order" className="navbar-link">
                                    Track Order
                                </Link>
                            </li>
                            <li>
                                <Link to="/orders" className="navbar-link">
                                    My Orders
                                </Link>
                            </li>
                            <li>
                                <Link to="/favorites" className="navbar-link">
                                    Favorites
                                </Link>
                            </li>
                            <li>
                                <Link to="/support" className="navbar-link">
                                    Support
                                </Link>
                            </li>
                            <li>
                                <Link to="/chatbot" className="navbar-link" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <GiChefToque style={{ fontSize: '1.2rem' }} /> Mr. Chef
                                </Link>
                            </li>
                            <li>
                                <Link to="/cart" className="navbar-link cart-link">
                                    <FaShoppingCart />
                                    {getItemCount() > 0 && (
                                        <span className="cart-badge">{getItemCount()}</span>
                                    )}
                                </Link>
                            </li>
                        </>
                    )}

                    {user && user.role === 'delivery_partner' && (
                        <>
                            <li>
                                <Link to="/delivery/dashboard" className="navbar-link">
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link to="/delivery/available-orders" className="navbar-link">
                                    Available Orders
                                </Link>
                            </li>
                            <li>
                                <Link to="/delivery/assigned-orders" className="navbar-link">
                                    Assigned Orders
                                </Link>
                            </li>
                            <li>
                                <Link to="/delivery/earnings" className="navbar-link">
                                    Earnings
                                </Link>
                            </li>
                        </>
                    )}

                    {user && user.role === 'admin' && (
                        <>
                            <li>
                                <Link to="/admin/dashboard" className="navbar-link">
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link to="/admin/orders" className="navbar-link">
                                    Orders
                                </Link>
                            </li>
                            <li>
                                <Link to="/admin/delivery-partners" className="navbar-link">
                                    Delivery Partners
                                </Link>
                            </li>
                            <li>
                                <Link to="/admin/coupons" className="navbar-link">
                                    Coupons
                                </Link>
                            </li>
                        </>
                    )}

                    {user ? (
                        <>
                            <li>
                                <Link
                                    to={
                                        user.role === 'delivery_partner'
                                            ? '/delivery/profile'
                                            : '/profile'
                                    }
                                    className="navbar-link"
                                >
                                    <FaUser /> {user.name}
                                </Link>
                            </li>
                            <li>
                                <button onClick={handleLogout} className="btn btn-outline">
                                    <FaSignOutAlt /> Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <li>
                            <Link to="/login" className="btn btn-primary">
                                Login
                            </Link>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
