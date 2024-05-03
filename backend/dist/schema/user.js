import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    googleId: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        required: true,
    },
});
const UserModel = mongoose.model("User", userSchema);
export default UserModel;
