import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import foodApi from '../../services/foodApi';
import { FaStar, FaClock, FaHeart, FaRegHeart } from 'react-icons/fa';
import './Favorites.css';

const Favorites = () => {
    const { user, updateUser } = useAuth();
    const [favorites, setFavorites] = useState([]);
    const [favoriteRestaurants, setFavoriteRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setFavorites(user?.favorites || []);
    }, [user]);

    useEffect(() => {
        const fetchFavoriteRestaurants = async () => {
            if (favorites.length === 0) {
                setFavoriteRestaurants([]);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                // Fetch all restaurants first (optimization: could fetch only specific IDs if API supported it)
                const allRestaurants = await foodApi.getRestaurants();

                const filtered = allRestaurants.filter(r => favorites.includes(r.id));

                const mapped = filtered.map(r => ({
                    _id: r.id,
                    name: r.title,
                    image: r.image,
                    cuisines: r.type || [],
                    avgRating: isNaN(Number(r.rating)) ? 4.0 : Number(r.rating),
                    deliveryTime: '30-40',
                    avgPrice: r.minCharge
                }));

                setFavoriteRestaurants(mapped);
            } catch (error) {
                console.error("Error fetching favorite restaurants:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFavoriteRestaurants();
    }, [favorites]);

    const removeFavorite = (e, restaurantId) => {
        e.preventDefault();
        const updatedFavorites = favorites.filter(id => id !== restaurantId);
        updateUser({ ...user, favorites: updatedFavorites });
    };

    return (
        <div className="favorites-page">
            <Navbar />

            <div className="container" style={{ padding: '40px 20px', flex: 1 }}>
                <h1>Favorite Restaurants</h1>

                {loading ? (
                    <div className="loading">Loading favorites...</div>
                ) : favoriteRestaurants.length > 0 ? (
                    <div className="favorites-grid">
                        {favoriteRestaurants.map((restaurant) => (
                            <div key={restaurant._id} className="restaurant-card-wrapper" style={{ position: 'relative' }}>
                                <button
                                    className="favorite-btn active"
                                    onClick={(e) => removeFavorite(e, restaurant._id)}
                                    title="Remove from favorites"
                                >
                                    <FaHeart />
                                </button>
                                <Link
                                    to={`/restaurant/${restaurant._id}`}
                                    className="restaurant-card"
                                >
                                    <div className="restaurant-image">
                                        <img src={restaurant.image} alt={restaurant.name} />
                                    </div>
                                    <div className="restaurant-info">
                                        <h3>{restaurant.name}</h3>
                                        <p className="cuisines">
                                            {restaurant.cuisines.slice(0, 3).join(', ')}
                                        </p>
                                        <div className="restaurant-meta">
                                            <span className="rating">
                                                <FaStar /> {restaurant.avgRating.toFixed(1)}
                                            </span>
                                            <span className="delivery-time">
                                                <FaClock /> {restaurant.deliveryTime} mins
                                            </span>
                                            <span className="price">{restaurant.avgPrice}</span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-favorites">
                        <FaHeart className="heart-icon" />
                        <h2>No favorites yet</h2>
                        <p>Start adding your favorite restaurants to see them here</p>
                        <Link to="/home" className="btn btn-primary">
                            Browse Restaurants
                        </Link>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default Favorites;
