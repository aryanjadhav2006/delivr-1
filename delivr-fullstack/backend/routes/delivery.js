const express = require('express');
const {
    getAvailableOrders,
    getAssignedOrders,
    acceptOrder,
    updateOrderStatus,
    getEarnings,
    getProfile,
    updateLocation,
} = require('../controllers/deliveryController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

const router = express.Router();

// All routes require authentication and delivery_partner role
router.use(protect);
router.use(authorize('delivery_partner'));

// Routes
router.get('/available-orders', getAvailableOrders);
router.get('/assigned-orders', getAssignedOrders);
router.post('/accept-order/:id', acceptOrder);
router.put('/update-status/:id', updateOrderStatus);
router.get('/earnings', getEarnings);
router.get('/profile', getProfile);
router.put('/update-location', updateLocation);

module.exports = router;
