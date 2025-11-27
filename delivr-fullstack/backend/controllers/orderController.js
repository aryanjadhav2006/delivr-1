const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
    try {
        const {
            restaurantId,
            items,
            deliveryAddress,
            paymentMethod,
            totalAmount,
            deliveryFee = 40,
            taxes = 0,
            discountAmount = 0,
        } = req.body;

        // Validate restaurant exists
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant not found',
            });
        }

        // Create order
        const order = await Order.create({
            userId: req.user.id,
            restaurantId,
            items,
            totalAmount,
            deliveryFee,
            taxes,
            discountAmount,
            deliveryAddress,
            paymentMethod,
            paymentStatus: 'completed', // Mock payment - auto complete
            status: 'confirmed',
        });

        // Populate restaurant and items
        await order.populate('restaurantId', 'name area city address deliveryTime');
        await order.populate('items.menuItemId', 'name price image');

        res.status(201).json({
            success: true,
            data: order,
            message: 'Order placed successfully',
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

// @desc    Get my orders
// @route   GET /api/orders
// @access  Private
exports.getMyOrders = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;

        const query = { userId: req.user.id };

        if (status) {
            query.status = status;
        }

        const orders = await Order.find(query)
            .populate('restaurantId', 'name area city image')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Order.countDocuments(query);

        res.status(200).json({
            success: true,
            count: orders.length,
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
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

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('restaurantId', 'name area city address phone image')
            .populate('deliveryPartnerId')
            .populate('userId', 'name phone');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        // Make sure user owns this order or is admin/delivery partner
        if (
            order.userId._id.toString() !== req.user.id &&
            req.user.role !== 'admin' &&
            (!order.deliveryPartnerId ||
                order.deliveryPartnerId.userId.toString() !== req.user.id)
        ) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to view this order',
            });
        }

        res.status(200).json({
            success: true,
            data: order,
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
// @route   PUT /api/orders/:id/status
// @access  Private
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        order.status = status;

        if (status === 'delivered') {
            order.deliveredAt = Date.now();
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
