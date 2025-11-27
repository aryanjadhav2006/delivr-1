const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
    {
        restaurantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Restaurant',
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
            default: 'Delicious food item',
        },
        isVeg: {
            type: Boolean,
            default: true,
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
        image: {
            type: String,
            default: 'https://via.placeholder.com/300x200?text=Food+Item',
        },
        rating: {
            type: Number,
            default: 4.0,
        },
        customizations: [
            {
                name: String,
                options: [String],
                required: {
                    type: Boolean,
                    default: false,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Create indexes
menuItemSchema.index({ restaurantId: 1 });
menuItemSchema.index({ category: 1 });
menuItemSchema.index({ isVeg: 1 });
menuItemSchema.index({ name: 'text', category: 'text' });

module.exports = mongoose.model('MenuItem', menuItemSchema);
