import userModel from "../models/userModel.js";

// Function to add products to the user's cart
const addToCart = async (req, res) => {
    try {
        // Destructure the required fields from the request body
        const { userId, itemId, size } = req.body;

        // Find the user by their ID to get their cart data
        const userData = await userModel.findById(userId);
        let cartData = userData.cartData; // Access the cart data

        // Check if the item already exists in the cart
        if (cartData[itemId]) {
            // If the item exists, check if the size exists
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1; // Increment the quantity for the size
            } else {
                cartData[itemId][size] = 1; // Add a new size for the item
            }
        } else {
            // If the item doesn't exist, create a new item entry
            cartData[itemId] = {};
            cartData[itemId][size] = 1; // Add the size with a quantity of 1
        }

        // Update the user's cart in the database
        await userModel.findByIdAndUpdate(userId, { cartData });

        // Send a success response to the client
        res.json({ success: true, message: "Added To Cart" });
    } catch (error) {
        // Log the error and send an error response
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};


// Function to update the quantity of an item in the user's cart
const updateCart = async (req, res) => {
    try {
        // Destructure the required fields from the request body
        const { userId, itemId, size, quantity } = req.body;

        // Find the user by their ID to get their cart data
        const userData = await userModel.findById(userId);
        let cartData = userData.cartData; // Access the cart data

        // Update the quantity for the specified item and size
        cartData[itemId][size] = quantity;

        // Save the updated cart data to the database
        await userModel.findByIdAndUpdate(userId, { cartData });

        // Send a success response to the client
        res.json({ success: true, message: "Cart Updated" });
    } catch (error) {
        // Log the error and send an error response
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};


// Function to get the user's current cart data
const getUserCart = async (req, res) => {
    try {
        // Destructure the user ID from the request body
        const { userId } = req.body;

        // Find the user by their ID to get their cart data
        const userData = await userModel.findById(userId);
        let cartData = userData.cartData; // Access the cart data

        // Send the cart data as a response to the client
        res.json({ success: true, cartData });
    } catch (error) {
        // Log the error and send an error response
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};


export { addToCart, updateCart, getUserCart }