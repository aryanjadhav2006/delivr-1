import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [restaurant, setRestaurant] = useState(null);

    // Load cart from localStorage on mount
    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        const storedRestaurant = localStorage.getItem('cartRestaurant');

        if (storedCart) {
            setCartItems(JSON.parse(storedCart));
        }
        if (storedRestaurant) {
            setRestaurant(JSON.parse(storedRestaurant));
        }
    }, []);

    // Save to localStorage whenever cart changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
        if (restaurant) {
            localStorage.setItem('cartRestaurant', JSON.stringify(restaurant));
        }
    }, [cartItems, restaurant]);

    const addToCart = (item, restaurantData) => {
        // Check if adding from different restaurant
        if (restaurant && restaurant._id !== restaurantData._id) {
            const confirm = window.confirm(
                `Your cart contains items from ${restaurant.name}. Do you want to clear the cart and add items from ${restaurantData.name}?`
            );

            if (!confirm) {
                return false;
            }

            // Clear cart and set new restaurant
            setCartItems([{ ...item, quantity: 1 }]);
            setRestaurant(restaurantData);
            return true;
        }

        // Set restaurant if cart is empty
        if (!restaurant) {
            setRestaurant(restaurantData);
        }

        // Check if item already in cart
        const existingItem = cartItems.find((i) => i._id === item._id);

        if (existingItem) {
            setCartItems(
                cartItems.map((i) =>
                    i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
                )
            );
        } else {
            setCartItems([...cartItems, { ...item, quantity: 1 }]);
        }

        return true;
    };

    const removeFromCart = (itemId) => {
        const updatedCart = cartItems.filter((item) => item._id !== itemId);
        setCartItems(updatedCart);

        // Clear restaurant if cart is empty
        if (updatedCart.length === 0) {
            setRestaurant(null);
            localStorage.removeItem('cartRestaurant');
        }
    };

    const updateQuantity = (itemId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(itemId);
            return;
        }

        setCartItems(
            cartItems.map((item) =>
                item._id === itemId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
        setRestaurant(null);
        localStorage.removeItem('cart');
        localStorage.removeItem('cartRestaurant');
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const getItemCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    const value = {
        cartItems,
        restaurant,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getItemCount,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
