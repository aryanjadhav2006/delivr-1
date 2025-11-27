const express = require('express');
const {
    getDashboard,
    getAllOrders,
    updateOrder,
    getDeliveryPartners,
    updateDeliveryPartnerStatus,
    getRestaurants,
    getCoupons,
    createCoupon,
    deleteCoupon,
    getComplaints,
    respondToComplaint,
    getAnalytics,
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// Dashboard
router.get('/dashboard', getDashboard);

// Orders
router.get('/orders', getAllOrders);
router.put('/orders/:id', updateOrder);

// Delivery Partners
router.get('/delivery-partners', getDeliveryPartners);
router.put('/delivery-partners/:id/status', updateDeliveryPartnerStatus);

// Restaurants
router.get('/restaurants', getRestaurants);

// Coupons
router.get('/coupons', getCoupons);
router.post('/coupons', createCoupon);
router.delete('/coupons/:id', deleteCoupon);

// Complaints
router.get('/complaints', getComplaints);
router.put('/complaints/:id', respondToComplaint);

// Analytics
router.get('/analytics', getAnalytics);

module.exports = router;
