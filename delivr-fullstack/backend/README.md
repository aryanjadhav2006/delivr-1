# Delivr Backend

Backend API for the Delivr food delivery platform built with Express.js, MongoDB, and JWT authentication.

## Features

- **Authentication**: JWT-based authentication with role-based access (customer, admin, delivery_partner)
- **Restaurant Management**: Browse restaurants with advanced filtering
- **Order Management**: Place orders, track status, order history
- **Delivery Partner Portal**: Accept orders, update status, track earnings
- **Admin Dashboard**: Manage orders, delivery partners, coupons, complaints, and analytics
- **Search**: Search restaurants and food items
- **Flexible Filtering**: Filter by location, cuisine, price, rating, veg/non-veg

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

## Installation

```bash
# Install dependencies
npm install

# Set up environment variables
# Create .env file with:
# MONGODB_URI=mongodb://localhost:27017/
# DB_NAME=delivr
# PORT=5000
# JWT_SECRET=your_secret_key
# JWT_EXPIRE=30d
# NODE_ENV=development

# Import data from data.json
npm run import-data

# Start development server
npm run dev

# Start production server
npm start
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user (protected)
- PUT `/api/auth/update-profile` - Update profile (protected)

### Restaurants
- GET `/api/restaurants` - Get all restaurants (with filters)
- GET `/api/restaurants/cuisines` - Get unique cuisines
- GET `/api/restaurants/locations` - Get locations
- GET `/api/restaurants/:id` - Get single restaurant
- GET `/api/restaurants/:id/menu` - Get restaurant menu

### Search
- GET `/api/search?q=query&city=Bangalore` - Search restaurants and food

### Orders (Customer)
- POST `/api/orders` - Create order
- GET `/api/orders` - Get my orders
- GET `/api/orders/:id` - Get order details
- PUT `/api/orders/:id/status` - Update status

### Delivery Partner
- GET `/api/delivery/available-orders` - Get available orders
- GET `/api/delivery/assigned-orders` - Get assigned orders
- POST `/api/delivery/accept-order/:id` - Accept order
- PUT `/api/delivery/update-status/:id` - Update order status
- GET `/api/delivery/earnings` - Get earnings
- GET `/api/delivery/profile` - Get profile
- PUT `/api/delivery/update-location` - Update location

### Admin
- GET `/api/admin/dashboard` - Get dashboard stats
- GET `/api/admin/orders` - Get all orders
- PUT `/api/admin/orders/:id` - Update order
- GET `/api/admin/delivery-partners` - Get delivery partners
- PUT `/api/admin/delivery-partners/:id/status` - Update DP status
- GET `/api/admin/restaurants` - Get restaurants
- GET `/api/admin/coupons` - Get coupons
- POST `/api/admin/coupons` - Create coupon
- DELETE `/api/admin/coupons/:id` - Delete coupon
- GET `/api/admin/complaints` - Get complaints
- PUT `/api/admin/complaints/:id` - Respond to complaint
- GET `/api/admin/analytics` - Get analytics

## Database Models

- User (role: customer/admin/delivery_partner)
- Restaurant
- MenuItem
- Order
- DeliveryPartner
- Coupon
- Complaint

## Project Structure

```
backend/
├── config/
│   └── db.js
├── models/
│   ├── User.js
│   ├── Restaurant.js
│   ├── MenuItem.js
│   ├── Order.js
│   ├── DeliveryPartner.js
│   ├── Coupon.js
│   └── Complaint.js
├── routes/
│   ├── auth.js
│   ├── restaurants.js
│   ├── search.js
│   ├── orders.js
│   ├── delivery.js
│   └── admin.js
├── controllers/
│   ├── authController.js
│   ├── restaurantController.js
│   ├── searchController.js
│   ├── orderController.js
│   ├── deliveryController.js
│   └── adminController.js
├── middleware/
│   ├── auth.js
│   └── roleCheck.js
├── utils/
│   └── importData.js
├── .env
├── .gitignore
├── package.json
└── server.js
```

## License

ISC
