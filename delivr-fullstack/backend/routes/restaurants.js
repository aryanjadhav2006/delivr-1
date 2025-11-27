const express = require('express');
const {
    getRestaurants,
    getRestaurantById,
    getRestaurantMenu,
    getCuisines,
    getLocations,
} = require('../controllers/restaurantController');

const router = express.Router();

// Routes
router.get('/', getRestaurants);
router.get('/cuisines', getCuisines);
router.get('/locations', getLocations);
router.get('/:id', getRestaurantById);
router.get('/:id/menu', getRestaurantMenu);

module.exports = router;
