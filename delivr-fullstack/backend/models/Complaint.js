const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ['user', 'delivery_partner', 'restaurant'],
            required: true,
        },
        reportedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        relatedTo: {
            modelType: {
                type: String,
                enum: ['User', 'DeliveryPartner', 'Restaurant', 'Order'],
            },
            id: {
                type: mongoose.Schema.Types.ObjectId,
            },
        },
        category: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'in_progress', 'resolved'],
            default: 'pending',
        },
        adminResponse: {
            type: String,
        },
        resolvedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

// Create indexes
complaintSchema.index({ type: 1 });
complaintSchema.index({ status: 1 });
complaintSchema.index({ reportedBy: 1 });

module.exports = mongoose.model('Complaint', complaintSchema);
