const express = require('express');
const { body } = require('express-validator');
const {
    register,
    login,
    getMe,
    updateProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const registerValidation = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('role').isIn(['customer', 'delivery_partner']).withMessage('Invalid role'),
];

const loginValidation = [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
];

// Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', protect, getMe);
router.put('/update-profile', protect, updateProfile);

module.exports = router;
