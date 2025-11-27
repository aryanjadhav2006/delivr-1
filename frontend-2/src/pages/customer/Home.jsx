import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import api from '../../utils/api';
import foodApi from '../../services/foodApi';
import { useLocation } from '../../context/LocationContext';
import { useAuth } from '../../context/AuthContext';
import { FaStar, FaClock, FaSearch, FaFilter, FaMapMarkerAlt, FaUtensils, FaHeart, FaRegHeart } from 'react-icons/fa';
import './Home.css';

const Home = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [cuisines, setCuisines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        cuisine: '',
        minRating: '',
        maxPrice: '',
        city: '',
    });

    const { selectedCity, setSelectedCity } = useLocation();
    const { user, updateUser } = useAuth();

    useEffect(() => {
        fetchCuisines();
        fetchRestaurants();
    }, []);

    useEffect(() => {
        fetchRestaurants();
    }, [filters, selectedCity]);

    const fetchCuisines = async () => {
        try {
            // Mock cuisines or fetch from API if available
            setCuisines(['Sushi', 'Burger', 'Pizza', 'Indian', 'Chinese', 'Italian', 'Mexican']);
        } catch (error) {
            console.error('Error fetching cuisines:', error);
        }
    };

    const fetchRestaurants = async () => {
        try {
            setLoading(true);
            const data = await foodApi.getRestaurants();

            // Map external API data to our component's expected structure
            let mappedRestaurants = data.map(r => ({
                _id: r.id,
                name: r.title,
                image: r.image,
                cuisines: r.type || [],
                avgRating: isNaN(Number(r.rating)) ? 4.0 : Number(r.rating), // Handle "ten" or other non-numbers
                deliveryTime: '30-40', // Mock
                avgPrice: r.minCharge
            }));

            // Client-side filtering
            if (filters.search) {
                mappedRestaurants = mappedRestaurants.filter(r =>
                    r.name.toLowerCase().includes(filters.search.toLowerCase())
                );
            }
            if (filters.cuisine) {
                mappedRestaurants = mappedRestaurants.filter(r =>
                    r.cuisines.some(c => c.toLowerCase() === filters.cuisine.toLowerCase())
                );
            }

            setRestaurants(mappedRestaurants);
        } catch (error) {
            console.error('Error fetching restaurants:', error);
            setRestaurants([]);
        } finally {
            setLoading(false);
        }
    };

    const handleLocationChange = (e) => {
        const value = e.target.value;
        if (value === 'current') {
            // Logic for current location would go here
            alert("Using current location...");
        } else if (value === 'add') {
            // Logic for adding address
            alert("Add address feature coming soon...");
        } else {
            setSelectedCity(value);
        }
    };

    const handleCuisineFilter = (cuisine) => {
        setFilters({ ...filters, cuisine: filters.cuisine === cuisine ? '' : cuisine });
    };

    const isFavorite = (restaurantId) => {
        return user?.favorites?.includes(restaurantId);
    };

    const toggleFavorite = (e, restaurantId) => {
        e.preventDefault(); // Prevent navigation to restaurant details
        e.stopPropagation();

        if (!user) {
            alert("Please login to add favorites");
            return;
        }

        const currentFavorites = user.favorites || [];
        let newFavorites;

        if (currentFavorites.includes(restaurantId)) {
            newFavorites = currentFavorites.filter(id => id !== restaurantId);
        } else {
            newFavorites = [...currentFavorites, restaurantId];
        }

        updateUser({ ...user, favorites: newFavorites });
    };

    return (
        <div className="home-page">
            <Navbar />

            <div className="container">
                {/* Hero Section */}
                <div className="hero-section">
                    <h1>Order Food from Your Favorite Restaurants</h1>

                    <div className="search-container-wrapper">
                        {/* Location Selector (Left) */}
                        <div className="location-wrapper">
                            <FaMapMarkerAlt className="input-icon" />
                            <select
                                className="custom-select"
                                onChange={handleLocationChange}
                                defaultValue=""
                            >
                                <option value="" disabled>Choose your location</option>
                                <option value="current">Use current location</option>
                                <option value="add">Add address</option>
                            </select>
                        </div>

                        {/* Search Bar (Center) */}
                        <div className="search-wrapper">
                            <FaSearch className="input-icon" />
                            <input
                                type="text"
                                placeholder="Search for restaurants..."
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                className="custom-input"
                            />
                        </div>

                        {/* Cuisine Filter (Right) */}
                        <div className="cuisine-wrapper">
                            <FaUtensils className="input-icon" />
                            <select
                                className="custom-select"
                                value={filters.cuisine}
                                onChange={(e) => setFilters({ ...filters, cuisine: e.target.value })}
                            >
                                <option value="">Browse by Cuisine</option>
                                <option value="Sushi">Sushi</option>
                                <option value="Burger">Burger</option>
                                <option value="Pizza">Pizza</option>
                                <option value="Indian">Indian</option>
                                <option value="Chinese">Chinese</option>
                                {cuisines.filter(c => !['Sushi', 'Burger', 'Pizza', 'Indian', 'Chinese'].includes(c)).map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Restaurants Grid */}
                <div className="restaurants-section">
                    <h2>Popular Restaurants</h2>

                    {loading ? (
                        <div className="loading">Loading restaurants...</div>
                    ) : restaurants.length > 0 ? (
                        <div className="restaurants-grid">
                            {restaurants.map((restaurant) => (
                                <div key={restaurant._id} className="restaurant-card-wrapper" style={{ position: 'relative' }}>
                                    <button
                                        className={`favorite-btn ${isFavorite(restaurant._id) ? 'active' : ''}`}
                                        onClick={(e) => toggleFavorite(e, restaurant._id)}
                                    >
                                        {isFavorite(restaurant._id) ? <FaHeart /> : <FaRegHeart />}
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
                        <div className="no-results">
                            <p>No restaurants found. Try adjusting your filters.</p>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Home;
