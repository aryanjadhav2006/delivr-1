import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import api from '../../utils/api';
import foodApi from '../../services/foodApi';
import { useCart } from '../../context/CartContext';
import { FaStar, FaClock, FaLeaf, FaPlus, FaMinus } from 'react-icons/fa';
import './RestaurantMenu.css';

const RestaurantMenu = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart, cartItems, updateQuantity } = useCart();

    const [restaurant, setRestaurant] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [vegOnly, setVegOnly] = useState(false);

    useEffect(() => {
        fetchRestaurant();
        fetchMenu();
    }, [id]);

    useEffect(() => {
        fetchMenu();
    }, [vegOnly]);

    const fetchRestaurant = async () => {
        try {
            const data = await foodApi.getRestaurantById(id);
            if (data) {
                setRestaurant({
                    _id: data.id,
                    name: data.title,
                    image: data.image,
                    cuisines: data.type || [],
                    area: 'Downtown', // Mock
                    city: 'Food City', // Mock
                    avgRating: isNaN(Number(data.rating)) ? 4.0 : Number(data.rating),
                    deliveryTime: 30,
                    avgPrice: data.minCharge
                });
            } else {
                // Fallback if not found in Gist (e.g. direct link to old ID)
                setRestaurant({
                    _id: id,
                    name: 'Restaurant Not Found',
                    image: 'https://via.placeholder.com/800x400',
                    cuisines: [],
                    area: '',
                    city: '',
                    avgRating: 0,
                    deliveryTime: 0,
                    avgPrice: 0
                });
            }
        } catch (error) {
            console.error('Error fetching restaurant:', error);
        }
    };

    const fetchMenu = async () => {
        try {
            setLoading(true);
            // First get the restaurant object to get the menu URL
            const restaurantData = await foodApi.getRestaurantById(id);
            if (restaurantData) {
                const menuData = await foodApi.getMenu(restaurantData);
                setMenuItems(vegOnly ? menuData.filter(i => i.isVeg) : menuData);
            }
        } catch (error) {
            console.error('Error fetching menu:', error);
        } finally {
            setLoading(false);
        }
    };

    const getItemQuantity = (itemId) => {
        const cartItem = cartItems.find((item) => item._id === itemId);
        return cartItem ? cartItem.quantity : 0;
    };

    // Normalize item for cart to ensure consistent structure
    const normalizeForCart = (item) => {
        return {
            _id: String(item._id),
            id: item._id,
            name: item.name,
            price: Number(item.price),
            image: item.image,
            restaurantId: restaurant?._id,
            quantity: 1,
        };
    };

    const handleAddToCart = (item) => {
        const cartItem = normalizeForCart(item);
        const success = addToCart(cartItem, restaurant);
        if (!success) {
            // User cancelled cart clear
            return;
        }
    };

    const handleIncrement = (item) => {
        const currentQty = getItemQuantity(item._id);
        if (currentQty === 0) {
            handleAddToCart(item);
        } else {
            updateQuantity(item._id, currentQty + 1);
        }
    };

    const handleDecrement = (item) => {
        const currentQty = getItemQuantity(item._id);
        if (currentQty > 0) {
            updateQuantity(item._id, currentQty - 1);
        }
    };

    if (!restaurant) {
        return (
            <div>
                <Navbar />
                <div className="loading">Loading restaurant...</div>
                <Footer />
            </div>
        );
    }

    // Group menu items by category
    const groupedItems = menuItems.reduce((acc, item) => {
        const category = item.category || 'Other';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(item);
        return acc;
    }, {});

    return (
        <div className="restaurant-menu-page">
            <Navbar />

            <div className="container">
                {/* Restaurant Header */}
                <div className="restaurant-header">
                    <div className="restaurant-image">
                        <img src={restaurant.image} alt={restaurant.name} />
                    </div>
                    <div className="restaurant-details">
                        <h1>{restaurant.name}</h1>
                        <p className="cuisines">{restaurant.cuisines.join(', ')}</p>
                        <p className="location">
                            {restaurant.area}, {restaurant.city}
                        </p>
                        <div className="restaurant-meta">
                            <span className="rating">
                                <FaStar /> {restaurant.avgRating.toFixed(1)}
                            </span>
                            <span className="delivery-time">
                                <FaClock /> {restaurant.deliveryTime} mins
                            </span>
                            <span className="price">₹{restaurant.avgPrice} for two</span>
                        </div>
                    </div>
                </div>

                {/* Veg Filter */}
                <div className="menu-filters">
                    <label className="veg-filter">
                        <input
                            type="checkbox"
                            checked={vegOnly}
                            onChange={(e) => setVegOnly(e.target.checked)}
                        />
                        <FaLeaf className="veg-icon" />
                        Veg Only
                    </label>
                </div>

                {/* Menu Items */}
                {loading ? (
                    <div className="loading">Loading menu...</div>
                ) : (
                    <div className="menu-section">
                        {Object.keys(groupedItems).length > 0 ? (
                            Object.keys(groupedItems).map((category) => (
                                <div key={category} className="category-section">
                                    <h2>{category}</h2>
                                    <div className="menu-items">
                                        {groupedItems[category].map((item) => {
                                            const quantity = getItemQuantity(item._id);
                                            return (
                                                <div key={item._id} className="menu-item">
                                                    <div className="item-info">
                                                        <div className="item-type">
                                                            {item.isVeg ? (
                                                                <span className="veg-badge">
                                                                    <FaLeaf />
                                                                </span>
                                                            ) : (
                                                                <span className="non-veg-badge">●</span>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <h3>{item.name}</h3>
                                                            {item.description && (
                                                                <p className="item-description">{item.description}</p>
                                                            )}
                                                            <p className="item-price">₹{item.price}</p>
                                                        </div>
                                                    </div>
                                                    <div className="item-actions">
                                                        {quantity === 0 ? (
                                                            <button
                                                                className="btn-add"
                                                                onClick={() => handleAddToCart(item)}
                                                            >
                                                                Add <FaPlus />
                                                            </button>
                                                        ) : (
                                                            <div className="quantity-controls">
                                                                <button onClick={() => handleDecrement(item)}>
                                                                    <FaMinus />
                                                                </button>
                                                                <span>{quantity}</span>
                                                                <button onClick={() => handleIncrement(item)}>
                                                                    <FaPlus />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-items">
                                <p>No menu items available.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* View Cart Button */}
                {cartItems.length > 0 && (
                    <div className="cart-footer">
                        <button className="btn btn-primary" onClick={() => navigate('/cart')}>
                            View Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
                        </button>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default RestaurantMenu;
