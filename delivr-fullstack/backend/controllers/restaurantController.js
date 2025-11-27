const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');

// @desc    Get all restaurants with filters
// @route   GET /api/restaurants
// @access  Public
exports.getRestaurants = async (req, res) => {
    try {
        const {
            city,
            area,
            cuisine,
            minRating,
            maxPrice,
            minPrice,
            search,
            page = 1,
            limit = 20,
        } = req.query;

        // Build query
        const query = { isActive: true };

        if (city) query.city = new RegExp(city, 'i');
        if (area) query.area = new RegExp(area, 'i');
        if (cuisine) query.cuisines = { $in: [new RegExp(cuisine, 'i')] };
        if (minRating) query.avgRating = { $gte: parseFloat(minRating) };
        if (maxPrice) query.avgPrice = { ...query.avgPrice, $lte: parseInt(maxPrice) };
        if (minPrice) query.avgPrice = { ...query.avgPrice, $gte: parseInt(minPrice) };
        if (search) {
            query.$text = { $search: search };
        }

        // Execute query with pagination
        const restaurants = await Restaurant.find(query)
            .sort({ avgRating: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Restaurant.countDocuments(query);

        res.status(200).json({
            success: true,
            count: restaurants.length,
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            data: restaurants,
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

// @desc    Get single restaurant
// @route   GET /api/restaurants/:id
// @access  Public
exports.getRestaurantById = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);

        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant not found',
            });
        }

        res.status(200).json({
            success: true,
            data: restaurant,
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

// @desc    Get restaurant menu
// @route   GET /api/restaurants/:id/menu
// @access  Public
exports.getRestaurantMenu = async (req, res) => {
    try {
        const { isVeg, category, search } = req.query;

        // Build query
        const query = { restaurantId: req.params.id, isAvailable: true };

        if (isVeg !== undefined) query.isVeg = isVeg === 'true';
        if (category) query.category = new RegExp(category, 'i');
        if (search) {
            query.$text = { $search: search };
        }

        const menuItems = await MenuItem.find(query).sort({ category: 1, name: 1 });

        // Group by category
        const groupedMenu = menuItems.reduce((acc, item) => {
            if (!acc[item.category]) {
                acc[item.category] = [];
            }
            acc[item.category].push(item);
            return acc;
        }, {});

        res.status(200).json({
            success: true,
            count: menuItems.length,
            data: menuItems,
            groupedByCategory: groupedMenu,
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

// @desc    Get all unique cuisines
// @route   GET /api/restaurants/cuisines
// @access  Public
exports.getCuisines = async (req, res) => {
    try {
        const cuisines = await Restaurant.distinct('cuisines');

        res.status(200).json({
            success: true,
            count: cuisines.length,
            data: cuisines.sort(),
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

// @desc    Get all unique locations
// @route   GET /api/restaurants/locations
// @access  Public
exports.getLocations = async (req, res) => {
    try {
        const cities = await Restaurant.distinct('city');
        const areas = await Restaurant.distinct('area');

        // Group areas by city
        const locationsByCity = {};

        for (const city of cities) {
            const cityAreas = await Restaurant.distinct('area', { city });
            locationsByCity[city] = cityAreas.sort();
        }

        res.status(200).json({
            success: true,
            data: {
                cities: cities.sort(),
                areas: areas.sort(),
                locationsByCity,
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
