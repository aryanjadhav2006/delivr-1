const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
        },
        discountType: {
            type: String,
            enum: ['percentage', 'flat'],
            required: true,
        },
        discountValue: {
            type: Number,
            required: true,
        },
        minOrderValue: {
            type: Number,
            default: 0,
        },
        maxDiscount: {
            type: Number,
            default: 0,
        },
        validFrom: {
            type: Date,
            default: Date.now,
        },
        validUntil: {
            type: Date,
            required: true,
        },
        usageLimit: {
            type: Number,
            default: 1000,
        },
        usedCount: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        applicableRestaurants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Restaurant',
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Create indexes
couponSchema.index({ code: 1 });
couponSchema.index({ isActive: 1 });
couponSchema.index({ validUntil: 1 });

module.exports = mongoose.model('Coupon', couponSchema);
