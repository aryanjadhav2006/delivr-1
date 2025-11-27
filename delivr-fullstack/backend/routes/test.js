const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');

// Test endpoint to check if images exist in database
router.get('/test-images', async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne();

        if (!restaurant) {
            return res.json({
                success: false,
                message: 'No restaurants found in database'
            });
        }

        res.json({
            success: true,
            sample: {
                name: restaurant.name,
                image: restaurant.image,
                hasImageField: !!restaurant.image,
                imageUrl: restaurant.image
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
