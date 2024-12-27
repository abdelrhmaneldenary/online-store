// Importing required modules
import validator from "validator"; // For validating email formats and other user inputs
import bcrypt from "bcrypt"; // For hashing and comparing passwords securely
import jwt from 'jsonwebtoken'; // For generating and verifying JSON Web Tokens (JWT)
import userModel from "../models/userModel.js"; // User schema/model for MongoDB

// Function to create a JWT token for a user
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET); // Sign a token with the user's ID using a secret key
};

// Route for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body; // Extracting email and password from the request body

        // Check if a user with the provided email exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User doesn't exist" });
        }

        // Compare the provided password with the hashed password stored in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            // If the password matches, generate a token and respond with success
            const token = createToken(user._id);
            res.json({ success: true, token });
        } else {
            // If the password doesn't match, respond with an error
            res.json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Route for user registration
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body; // Extracting user details from the request body

        // Check if a user with the provided email already exists
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }

        // Validate email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        // Validate password strength
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        // Hash the password using bcrypt
        const salt = await bcrypt.genSalt(10); // Generate a salt for hashing
        const hashedPassword = await bcrypt.hash(password, salt); // Hash the password with the salt

        // Create a new user object
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
        });

        // Save the user to the database
        const user = await newUser.save();

        // Generate a token for the user
        const token = createToken(user._id);

        // Respond with success and the token
        res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Route for admin login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body; // Extract email and password from the request body

        // Check if the provided credentials match the admin credentials stored in environment variables
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            // If the credentials match, generate a token and respond with success
            const token = jwt.sign(email + password, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            // If the credentials don't match, respond with an error
            res.json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Exporting the functions for use in routes
export { loginUser, registerUser, adminLogin };
