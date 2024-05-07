import mongoose from "mongoose";
const devicesSchema = new mongoose.Schema({
    fullInfo: Object,
    ipAddress: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    isLoggedIn: Boolean,
    lastLoggedIn: Date,
});
const DevicesModel = mongoose.model("Devices", devicesSchema);
export default DevicesModel;
