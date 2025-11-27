const mongoose = require('mongoose');

const deliveryPartnerSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        vehicleType: {
            type: String,
            enum: ['bike', 'scooter', 'bicycle', 'car'],
            required: true,
        },
        vehicleNumber: {
            type: String,
            required: true,
        },
        drivingLicense: {
            type: String,
        },
        currentLocation: {
            lat: {
                type: Number,
                default: 0,
            },
            lng: {
                type: Number,
                default: 0,
            },
        },
        status: {
            type: String,
            enum: ['active', 'inactive', 'suspended'],
            default: 'active',
        },
        rating: {
            type: Number,
            default: 4.5,
            min: 0,
            max: 5,
        },
        totalDeliveries: {
            type: Number,
            default: 0,
        },
        totalEarnings: {
            type: Number,
            default: 0,
        },
        dailyEarnings: {
            type: Number,
            default: 0,
        },
        weeklyEarnings: {
            type: Number,
            default: 0,
        },
        bonuses: {
            type: Number,
            default: 0,
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
        isOnDelivery: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Create indexes
deliveryPartnerSchema.index({ userId: 1 });
deliveryPartnerSchema.index({ status: 1 });
deliveryPartnerSchema.index({ isAvailable: 1 });

module.exports = mongoose.model('DeliveryPartner', deliveryPartnerSchema);
