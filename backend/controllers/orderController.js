// Importing required modules and models
import orderModel from "../models/orderModel.js"; // Order schema/model for MongoDB
import userModel from "../models/userModel.js"; // User schema/model for MongoDB
import Stripe from 'stripe'; // Stripe for payment integration
import razorpay from 'razorpay'; // Razorpay for payment integration

// Global constants for currency and delivery charges
const currency = 'inr'; // Currency for payment processing
const deliveryCharge = 10; // Fixed delivery charge amount

// Initializing Stripe with secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Initializing Razorpay instance with credentials from environment variables
const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Placing an order using Cash on Delivery (COD) method
const placeOrder = async (req, res) => {
    try {
        // Extracting required details from request body
        const { userId, items, amount, address } = req.body;

        // Creating order data
        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "COD",
            payment: false, // Payment is pending for COD
            date: Date.now(),
        };

        // Saving the order to the database
        const newOrder = new orderModel(orderData);
        await newOrder.save();

        // Clearing user's cart data after order placement
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        // Sending success response
        res.json({ success: true, message: "Order Placed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Placing an order using Stripe payment method
const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const { origin } = req.headers; // Get origin for redirect URLs

        // Create order data
        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "Stripe",
            payment: false,
            date: Date.now(),
        };

        // Save order to database
        const newOrder = new orderModel(orderData);
        await newOrder.save();

        // Prepare line items for Stripe checkout
        const line_items = items.map((item) => ({
            price_data: {
                currency: currency,
                product_data: { name: item.name },
                unit_amount: item.price * 100, // Convert to smallest currency unit
            },
            quantity: item.quantity,
        }));

        // Add delivery charges as a line item
        line_items.push({
            price_data: {
                currency: currency,
                product_data: { name: 'Delivery Charges' },
                unit_amount: deliveryCharge * 100,
            },
            quantity: 1,
        });

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment',
        });

        // Send session URL to frontend
        res.json({ success: true, session_url: session.url });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Verifying Stripe payment status
const verifyStripe = async (req, res) => {
    const { orderId, success, userId } = req.body;

    try {
        if (success === "true") {
            // Mark payment as completed if success
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            await userModel.findByIdAndUpdate(userId, { cartData: {} });
            res.json({ success: true });
        } else {
            // Delete order if payment failed
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Placing an order using Razorpay payment method
const placeOrderRazorpay = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        // Create order data
        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "Razorpay",
            payment: false,
            date: Date.now(),
        };

        // Save order to database
        const newOrder = new orderModel(orderData);
        await newOrder.save();

        // Create Razorpay order
        const options = {
            amount: amount * 100, // Convert to smallest currency unit
            currency: currency.toUpperCase(),
            receipt: newOrder._id.toString(),
        };

        razorpayInstance.orders.create(options, (error, order) => {
            if (error) {
                console.log(error);
                return res.json({ success: false, message: error });
            }
            res.json({ success: true, order });
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Verifying Razorpay payment status
const verifyRazorpay = async (req, res) => {
    try {
        const { userId, razorpay_order_id } = req.body;

        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
        if (orderInfo.status === 'paid') {
            // Update payment status if payment is completed
            await orderModel.findByIdAndUpdate(orderInfo.receipt, { payment: true });
            await userModel.findByIdAndUpdate(userId, { cartData: {} });
            res.json({ success: true, message: "Payment Successful" });
        } else {
            res.json({ success: false, message: 'Payment Failed' });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Fetch all orders for admin panel
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Fetch user-specific orders
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body;

        const orders = await orderModel.find({ userId });
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Update order status from admin panel
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        await orderModel.findByIdAndUpdate(orderId, { status });
        res.json({ success: true, message: 'Status Updated' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Export all functions for use in routes
export {
    verifyRazorpay,
    verifyStripe,
    placeOrder,
    placeOrderStripe,
    placeOrderRazorpay,
    allOrders,
    userOrders,
    updateStatus,
};
