import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // ID of the user placing the order
    items: { type: Array, required: true }, // Array of items in the order
    amount: { type: Number, required: true }, // Total cost of the order
    address: { type: Object, required: true }, // Address object for delivery
    status: { type: String, required: true, default: 'Order Placed' }, // Order status
    paymentMethod: { type: String, required: true }, // Payment method (e.g., 'Card', 'Cash')
    payment: { type: Boolean, required: true, default: false }, // Payment status (paid or not)
    date: { type: Number, required: true }, // Timestamp for order placement
  })
  

const orderModel = mongoose.models.order || mongoose.model('order',orderSchema)

export default orderModel;