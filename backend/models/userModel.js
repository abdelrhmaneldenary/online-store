import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },      // User's name (required)
    email: { type: String, required: true, unique: true }, // User's email (required and must be unique)
    password: { type: String, required: true }, // User's hashed password (required)
    cartData: { type: Object, default: {} },    // Object to store user's cart data (default is an empty object)
  }, { minimize: false })
  
const userModel = mongoose.models.user || mongoose.model('user',userSchema);

export default userModel