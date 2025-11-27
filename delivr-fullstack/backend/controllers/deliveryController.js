const Order = require('../models/Order');
const DeliveryPartner = require('../models/DeliveryPartner');

// @desc    Get available orders (not assigned)
// @route   GET /api/delivery/available-orders
// @access  Private (Delivery Partner)
exports.getAvailableOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            status: 'confirmed',
            deliveryPartnerId: null,
        })
            .populate('restaurantId', 'name area city address')
            .populate('userId', 'name phone')
            .sort({ createdAt: 1 })
            .limit(20);

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders,
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

// @desc    Get assigned orders
// @route   GET /api/delivery/assigned-orders
// @access  Private (Delivery Partner)
exports.getAssignedOrders = async (req, res) => {
    try {
        // Get delivery partner profile
        const deliveryPartner = await DeliveryPartner.findOne({ userId: req.user.id });

        if (!deliveryPartner) {
            return res.status(404).json({
                success: false,
                message: 'Delivery partner profile not found',
            });
        }

        const orders = await Order.find({
            deliveryPartnerId: deliveryPartner._id,
            status: { $nin: ['delivered', 'cancelled'] },
        })
            .populate('restaurantId', 'name area city address')
            .populate('userId', 'name phone')
            .sort({ createdAt: 1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders,
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

// @desc    Accept an order
// @route   POST /api/delivery/accept-order/:id
// @access  Private (Delivery Partner)
exports.acceptOrder = async (req, res) => {
    try {
        // Get delivery partner profile
        const deliveryPartner = await DeliveryPartner.findOne({ userId: req.user.id });

        if (!deliveryPartner) {
            return res.status(404).json({
                success: false,
                message: 'Delivery partner profile not found',
            });
        }

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        if (order.deliveryPartnerId) {
            return res.status(400).json({
                success: false,
                message: 'Order already assigned to another delivery partner',
            });
        }

        order.deliveryPartnerId = deliveryPartner._id;
        order.status = 'preparing';
        await order.save();

        // Update delivery partner status
        deliveryPartner.isOnDelivery = true;
        await deliveryPartner.save();

        res.status(200).json({
            success: true,
            data: order,
            message: 'Order accepted successfully',
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

// @desc    Update order status
// @route   PUT /api/delivery/update-status/:id
// @access  Private (Delivery Partner)
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const deliveryPartner = await DeliveryPartner.findOne({ userId: req.user.id });

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        // Check if this DP is assigned to this order
        if (order.deliveryPartnerId.toString() !== deliveryPartner._id.toString()) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to update this order',
            });
        }

        order.status = status;

        if (status === 'delivered') {
            order.deliveredAt = Date.now();

            // Update delivery partner earnings and stats
            const earnings = Math.floor((order.totalAmount * 0.1) + 50); // 10% + base fee
            deliveryPartner.totalDeliveries += 1;
            deliveryPartner.totalEarnings += earnings;
            deliveryPartner.dailyEarnings += earnings;
            deliveryPartner.weeklyEarnings += earnings;
            deliveryPartner.isOnDelivery = false;
            await deliveryPartner.save();
        }

        await order.save();

        res.status(200).json({
            success: true,
            data: order,
            message: 'Order status updated successfully',
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

// @desc    Get earnings
// @route   GET /api/delivery/earnings
// @access  Private (Delivery Partner)
exports.getEarnings = async (req, res) => {
    try {
        const deliveryPartner = await DeliveryPartner.findOne({ userId: req.user.id });

        if (!deliveryPartner) {
            return res.status(404).json({
                success: false,
                message: 'Delivery partner profile not found',
            });
        }

        res.status(200).json({
            success: true,
            data: {
                dailyEarnings: deliveryPartner.dailyEarnings,
                weeklyEarnings: deliveryPartner.weeklyEarnings,
                totalEarnings: deliveryPartner.totalEarnings,
                bonuses: deliveryPartner.bonuses,
                totalDeliveries: deliveryPartner.totalDeliveries,
                rating: deliveryPartner.rating,
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

// @desc    Get delivery partner profile
// @route   GET /api/delivery/profile
// @access  Private (Delivery Partner)
exports.getProfile = async (req, res) => {
    try {
        const deliveryPartner = await DeliveryPartner.findOne({ userId: req.user.id }).populate(
            'userId',
            'name email phone'
        );

        if (!deliveryPartner) {
            return res.status(404).json({
                success: false,
                message: 'Delivery partner profile not found',
            });
        }

        res.status(200).json({
            success: true,
            data: deliveryPartner,
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

// @desc    Update delivery partner location
// @route   PUT /api/delivery/update-location
// @access  Private (Delivery Partner)
exports.updateLocation = async (req, res) => {
    try {
        const { lat, lng } = req.body;

        const deliveryPartner = await DeliveryPartner.findOne({ userId: req.user.id });

        if (!deliveryPartner) {
            return res.status(404).json({
                success: false,
                message: 'Delivery partner profile not found',
            });
        }

        deliveryPartner.currentLocation = { lat, lng };
        await deliveryPartner.save();

        res.status(200).json({
            success: true,
            data: deliveryPartner,
            message: 'Location updated successfully',
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
