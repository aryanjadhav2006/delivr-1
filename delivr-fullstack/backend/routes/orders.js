const express = require('express');
const {
    createOrder,
    getMyOrders,
    getOrderById,
    updateOrderStatus,
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Routes
router.post('/', createOrder);
router.get('/', getMyOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', updateOrderStatus);

module.exports = router;
