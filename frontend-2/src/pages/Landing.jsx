import { Link } from 'react-router-dom';
import { FaUtensils, FaShippingFast, FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import './Landing.css';

const Landing = () => {
    return (
        <div className="landing-page">
            <Navbar />

            <section className="hero">
                <div className="container hero-container">
                    <div className="hero-content">
                        <h1>Your favorite food, <br /> delivered fast.</h1>
                        <p>
                            Order from your favorite local restaurants with just a few clicks.
                        </p>
                        <div className="hero-buttons">
                            <Link to="/register" className="btn btn-primary btn-large">
                                Order Now
                            </Link>
                            <Link to="/login" className="btn btn-outline btn-large">
                                How to Order
                            </Link>
                        </div>
                    </div>
                    <div className="hero-image">
                        {/* Placeholder for the big sushi platter image */}
                        <div className="sushi-platter-placeholder">
                            <div className="platter-circle"></div>
                            <span className="floating-emoji">🍣</span>
                            <span className="floating-emoji">🍱</span>
                            <span className="floating-emoji">🍔</span>
                            <input type="email" placeholder="Enter your email" />
                            <button className="btn btn-primary">Sign Up</button>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Landing;
