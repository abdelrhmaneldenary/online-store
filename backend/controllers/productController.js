// Importing required modules
import { v2 as cloudinary } from "cloudinary"; // Cloudinary for image upload and management
import productModel from "../models/productModel.js"; // Product schema/model for MongoDB

// Function to add a new product
const addProduct = async (req, res) => {
    try {
        // Destructuring product details from the request body
        const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

        // Extracting images from the request's files
        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];

        // Filtering out undefined images
        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

        // Uploading images to Cloudinary and collecting their URLs
        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                return result.secure_url;
            })
        );

        // Constructing product data
        const productData = {
            name,
            description,
            category,
            price: Number(price), // Ensure price is a number
            subCategory,
            bestseller: bestseller === "true" ? true : false, // Convert string to boolean
            sizes: JSON.parse(sizes), // Parse sizes as JSON
            image: imagesUrl, // Array of uploaded image URLs
            date: Date.now(), // Timestamp for when the product is added
        };

        console.log(productData);

        // Creating and saving the product to the database
        const product = new productModel(productData);
        await product.save();

        // Sending success response
        res.json({ success: true, message: "Product Added" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Function to list all products
const listProducts = async (req, res) => {
    try {
        // Fetch all products from the database
        const products = await productModel.find({});
        res.json({ success: true, products });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Function to remove a product
const removeProduct = async (req, res) => {
    try {
        // Remove product by its ID
        await productModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Product Removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Function to get details of a single product
const singleProduct = async (req, res) => {
    try {
        // Fetch product ID from the request body
        const { productId } = req.body;

        // Find product by ID in the database
        const product = await productModel.findById(productId);
        res.json({ success: true, product });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Exporting all the functions to be used in routes
export { listProducts, addProduct, removeProduct, singleProduct };
