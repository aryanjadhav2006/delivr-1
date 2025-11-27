const express = require('express');
const { searchRestaurantsAndFood } = require('../controllers/searchController');

const router = express.Router();

// Routes
router.get('/', searchRestaurantsAndFood);

module.exports = router;
