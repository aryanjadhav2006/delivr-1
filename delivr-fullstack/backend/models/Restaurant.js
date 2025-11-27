const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        area: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        cuisines: [
            {
                type: String,
            },
        ],
        avgRating: {
            type: Number,
            default: 0,
        },
        totalRatings: {
            type: Number,
            default: 0,
        },
        avgPrice: {
            type: Number,
            required: true,
        },
        deliveryTime: {
            type: Number,
            required: true,
        },
        image: {
            type: String,
            default: 'https://via.placeholder.com/400x250?text=Restaurant',
        },
        operatingHours: {
            open: {
                type: String,
                default: '09:00',
            },
            close: {
                type: String,
                default: '23:00',
            },
        },
        offers: [
            {
                title: String,
                discount: Number,
                validUntil: Date,
            },
        ],
        prepTime: {
            type: Number,
            default: 15,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Create indexes for faster searching
restaurantSchema.index({ city: 1, area: 1 });
restaurantSchema.index({ cuisines: 1 });
restaurantSchema.index({ avgRating: -1 });
restaurantSchema.index({ name: 'text', cuisines: 'text' });

module.exports = mongoose.model('Restaurant', restaurantSchema);
