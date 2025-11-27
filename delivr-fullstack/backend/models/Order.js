const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        orderId: {
            type: String,
            required: true,
            unique: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        restaurantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Restaurant',
            required: true,
        },
        items: [
            {
                menuItemId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'MenuItem',
                },
                name: String,
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
                price: {
                    type: Number,
                    required: true,
                },
                customizations: [String],
            },
        ],
        totalAmount: {
            type: Number,
            required: true,
        },
        deliveryFee: {
            type: Number,
            default: 40,
        },
        taxes: {
            type: Number,
            default: 0,
        },
        discountAmount: {
            type: Number,
            default: 0,
        },
        deliveryAddress: {
            street: String,
            city: String,
            area: String,
            pincode: String,
        },
        status: {
            type: String,
            enum: [
                'pending',
                'confirmed',
                'preparing',
                'ready',
                'picked_up',
                'out_for_delivery',
                'delivered',
                'cancelled',
            ],
            default: 'pending',
        },
        deliveryPartnerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'DeliveryPartner',
        },
        paymentMethod: {
            type: String,
            enum: ['upi', 'credit_card', 'debit_card', 'cod'],
            required: true,
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'completed', 'failed', 'refunded'],
            default: 'completed', // Mock payment - auto complete
        },
        otp: {
            type: String,
        },
        deliveredAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

// Generate order ID before saving
orderSchema.pre('save', function (next) {
    if (!this.orderId) {
        this.orderId = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;
    }
    next();
});

// Create indexes
orderSchema.index({ userId: 1 });
orderSchema.index({ restaurantId: 1 });
orderSchema.index({ deliveryPartnerId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
