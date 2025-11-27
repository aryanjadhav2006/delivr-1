const Order = require('../models/Order');
const User = require('../models/User');
const DeliveryPartner = require('../models/DeliveryPartner');
const Restaurant = require('../models/Restaurant');
const Coupon = require('../models/Coupon');
const Complaint = require('../models/Complaint');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
exports.getDashboard = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);

        // Get stats
        const [
            totalOrdersToday,
            totalOrdersWeek,
            activeUsers,
            activeDeliveryPartners,
            pendingOrders,
            revenueToday,
            revenueWeek,
        ] = await Promise.all([
            Order.countDocuments({ createdAt: { $gte: today } }),
            Order.countDocuments({ createdAt: { $gte: weekAgo } }),
            User.countDocuments({ role: 'customer' }),
            DeliveryPartner.countDocuments({ status: 'active' }),
            Order.countDocuments({ status: { $in: ['pending', 'confirmed'] } }),
            Order.aggregate([
                { $match: { createdAt: { $gte: today }, status: { $ne: 'cancelled' } } },
                { $group: { _id: null, total: { $sum: '$totalAmount' } } },
            ]),
            Order.aggregate([
                { $match: { createdAt: { $gte: weekAgo }, status: { $ne: 'cancelled' } } },
                { $group: { _id: null, total: { $sum: '$totalAmount' } } },
            ]),
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalOrdersToday,
                totalOrdersWeek,
                activeUsers,
                activeDeliveryPartners,
                pendingOrders,
                revenueToday: revenueToday[0]?.total || 0,
                revenueWeek: revenueWeek[0]?.total || 0,
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

// @desc    Get all orders with filters
// @route   GET /api/admin/orders
// @access  Private (Admin)
exports.getAllOrders = async (req, res) => {
    try {
        const { status, date, page = 1, limit = 20 } = req.query;

        const query = {};

        if (status && status !== 'all') {
            query.status = status;
        }

        if (date === 'today') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            query.createdAt = { $gte: today };
        }

        const orders = await Order.find(query)
            .populate('restaurantId', 'name area city')
            .populate('userId', 'name phone email')
            .populate('deliveryPartnerId')
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

// @desc    Update order
// @route   PUT /api/admin/orders/:id
// @access  Private (Admin)
exports.updateOrder = async (req, res) => {
    try {
        const { status, deliveryPartnerId } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        if (status) order.status = status;
        if (deliveryPartnerId) order.deliveryPartnerId = deliveryPartnerId;

        await order.save();

        res.status(200).json({
            success: true,
            data: order,
            message: 'Order updated successfully',
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

// @desc    Get all delivery partners
// @route   GET /api/admin/delivery-partners
// @access  Private (Admin)
exports.getDeliveryPartners = async (req, res) => {
    try {
        const { status, minRating, page = 1, limit = 20 } = req.query;

        const query = {};

        if (status) query.status = status;
        if (minRating) query.rating = { $gte: parseFloat(minRating) };

        const deliveryPartners = await DeliveryPartner.find(query)
            .populate('userId', 'name email phone')
            .sort({ rating: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await DeliveryPartner.countDocuments(query);

        res.status(200).json({
            success: true,
            count: deliveryPartners.length,
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            data: deliveryPartners,
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

// @desc    Update delivery partner status
// @route   PUT /api/admin/delivery-partners/:id/status
// @access  Private (Admin)
exports.updateDeliveryPartnerStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const deliveryPartner = await DeliveryPartner.findById(req.params.id);

        if (!deliveryPartner) {
            return res.status(404).json({
                success: false,
                message: 'Delivery partner not found',
            });
        }

        deliveryPartner.status = status;
        await deliveryPartner.save();

        res.status(200).json({
            success: true,
            data: deliveryPartner,
            message: `Delivery partner ${status} successfully`,
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

// @desc    Get all restaurants
// @route   GET /api/admin/restaurants
// @access  Private (Admin)
exports.getRestaurants = async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;

        const restaurants = await Restaurant.find()
            .sort({ avgRating: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Restaurant.countDocuments();

        res.status(200).json({
            success: true,
            count: restaurants.length,
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            data: restaurants,
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

// @desc    Get all coupons
// @route   GET /api/admin/coupons
// @access  Private (Admin)
exports.getCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: coupons.length,
            data: coupons,
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

// @desc    Create coupon
// @route   POST /api/admin/coupons
// @access  Private (Admin)
exports.createCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.create(req.body);

        res.status(201).json({
            success: true,
            data: coupon,
            message: 'Coupon created successfully',
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

// @desc    Delete coupon
// @route   DELETE /api/admin/coupons/:id
// @access  Private (Admin)
exports.deleteCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndDelete(req.params.id);

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Coupon not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Coupon deleted successfully',
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

// @desc    Get all complaints
// @route   GET /api/admin/complaints
// @access  Private (Admin)
exports.getComplaints = async (req, res) => {
    try {
        const { type, status } = req.query;

        const query = {};

        if (type) query.type = type;
        if (status) query.status = status;

        const complaints = await Complaint.find(query)
            .populate('reportedBy', 'name email phone')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: complaints.length,
            data: complaints,
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

// @desc    Respond to complaint
// @route   PUT /api/admin/complaints/:id
// @access  Private (Admin)
exports.respondToComplaint = async (req, res) => {
    try {
        const { adminResponse, status } = req.body;

        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: 'Complaint not found',
            });
        }

        complaint.adminResponse = adminResponse;
        complaint.status = status || 'in_progress';

        if (status === 'resolved') {
            complaint.resolvedAt = Date.now();
        }

        await complaint.save();

        res.status(200).json({
            success: true,
            data: complaint,
            message: 'Response submitted successfully',
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

// @desc    Get analytics
// @route   GET /api/admin/analytics
// @access  Private (Admin)
exports.getAnalytics = async (req, res) => {
    try {
        // Get total revenue
        const totalRevenue = await Order.aggregate([
            { $match: { status: { $ne: 'cancelled' } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } },
        ]);

        // Get order count by status
        const ordersByStatus = await Order.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } },
        ]);

        // Get top restaurants by orders
        const topRestaurants = await Order.aggregate([
            { $match: { status: { $ne: 'cancelled' } } },
            { $group: { _id: '$restaurantId', orderCount: { $sum: 1 } } },
            { $sort: { orderCount: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'restaurants',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'restaurant',
                },
            },
            { $unwind: '$restaurant' },
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalRevenue: totalRevenue[0]?.total || 0,
                ordersByStatus,
                topRestaurants,
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
