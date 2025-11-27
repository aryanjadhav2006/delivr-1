import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

const AssignedOrders = () => {
    return (
        <div>
            <Navbar />
            <div className="container" style={{ padding: '40px 20px' }}>
                <h1>Assigned Orders</h1>
                <p>Your assigned orders coming soon!</p>
            </div>
            <Footer />
        </div>
    );
};

export default AssignedOrders;
