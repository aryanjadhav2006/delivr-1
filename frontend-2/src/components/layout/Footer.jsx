import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3>Delivr</h3>
                        <p>Your favorite food, delivered fast.</p>
                    </div>

                    <div className="footer-section">
                        <h3>Quick Links</h3>
                        <ul>
                            <li>
                                <Link to="/home">Browse Restaurants</Link>
                            </li>
                            <li>
                                <Link to="/orders">My Orders</Link>
                            </li>
                            <li>
                                <Link to="/profile">Profile</Link>
                            </li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h3>Company</h3>
                        <ul>
                            <li>
                                <a href="#about">About Us</a>
                            </li>
                            <li>
                                <a href="#careers">Careers</a>
                            </li>
                            <li>
                                <a href="#contact">Contact</a>
                            </li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h3>Legal</h3>
                        <ul>
                            <li>
                                <a href="#terms">Terms of Service</a>
                            </li>
                            <li>
                                <a href="#privacy">Privacy Policy</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Delivr. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
