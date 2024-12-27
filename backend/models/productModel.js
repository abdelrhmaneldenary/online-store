import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Name of the product (mandatory)
    description: { type: String, required: true }, // Product description (mandatory)
    price: { type: Number, required: true }, // Product price (mandatory)
    image: { type: Array, required: true }, // Array of image URLs for the product
    category: { type: String, required: true }, // Main category of the product (e.g., Electronics)
    subCategory: { type: String, required: true }, // Subcategory (e.g., Mobile Phones)
    sizes: { type: Array, required: true }, // Array of available sizes (e.g., ["S", "M", "L"])
    bestseller: { type: Boolean }, // Indicates if the product is a bestseller
    date: { type: Number, required: true }, // Timestamp representing when the product was added
  })
  

const productModel  = mongoose.models.product || mongoose.model("product",productSchema);

export default productModel