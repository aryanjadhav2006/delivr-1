const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');

// @desc    Search restaurants and food items
// @route   GET /api/search
// @access  Public
exports.searchRestaurantsAndFood = async (req, res) => {
    try {
        const { q, city } = req.query;

        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a search query',
            });
        }

        // Build restaurant query
        const restaurantQuery = {
            $text: { $search: q },
            isActive: true,
        };

        if (city) {
            restaurantQuery.city = new RegExp(city, 'i');
        }

        // Search restaurants
        const restaurants = await Restaurant.find(restaurantQuery)
            .limit(10)
            .select('name area city cuisines avgRating avgPrice deliveryTime image');

        // Search menu items
        const menuItems = await MenuItem.find({
            $text: { $search: q },
            isAvailable: true,
        })
            .limit(15)
            .populate('restaurantId', 'name area city avgRating deliveryTime');

        res.status(200).json({
            success: true,
            data: {
                restaurants,
                menuItems,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};
