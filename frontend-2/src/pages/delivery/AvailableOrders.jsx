import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

const AvailableOrders = () => {
    return (
        <div>
            <Navbar />
            <div className="container" style={{ padding: '40px 20px' }}>
                <h1>Available Orders</h1>
                <p>Available orders to accept coming soon!</p>
            </div>
            <Footer />
        </div>
    );
};

export default AvailableOrders;
