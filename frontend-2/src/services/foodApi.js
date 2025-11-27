import axios from 'axios';

const MAIN_DB_URL = 'https://gist.githubusercontent.com/omar94hamza/c96f0be02bffa48056e12893be8eda36/raw';

const foodApi = {
    getRestaurants: async () => {
        try {
            const response = await axios.get(MAIN_DB_URL);
            return response.data;
        } catch (error) {
            console.error('Error fetching restaurants:', error);
            return [];
        }
    },

    getRestaurantById: async (id) => {
        try {
            const restaurants = await foodApi.getRestaurants();
            return restaurants.find(r => r.id === id);
        } catch (error) {
            console.error('Error fetching restaurant by id:', error);
            return null;
        }
    },

    getMenu: async (restaurant) => {
        if (!restaurant || !restaurant.url_menucat) return [];

        try {
            // 1. Fetch Menu Categories
            const catResponse = await axios.get(restaurant.url_menucat);
            // The key for the categories list is stored in restaurant.titlMC
            const categories = catResponse.data[restaurant.titlMC] || [];

            // 2. Fetch Items for each Category
            const menuPromises = categories.map(async (category) => {
                try {
                    const itemResponse = await axios.get(category.item_url);
                    // The key for the items list is stored in category.list_title
                    const rawItems = itemResponse.data[category.list_title] || [];

                    // Map to our app's structure
                    return rawItems.map(item => ({
                        _id: item.item_id || Math.random().toString(36).substr(2, 9),
                        name: item.title,
                        description: item.des,
                        price: parseFloat(item.price.replace(/[^0-9.]/g, '')), // Extract number from "20.00 EGP"
                        image: item.image,
                        category: category.title,
                        isVeg: false, // API doesn't specify, default to false or random?
                        rating: 4.5 // Default rating
                    }));
                } catch (err) {
                    console.error(`Error fetching items for category ${category.title}:`, err);
                    return [];
                }
            });

            const results = await Promise.all(menuPromises);
            return results.flat();
        } catch (error) {
            console.error('Error fetching menu:', error);
            return [];
        }
    }
};

export default foodApi;
