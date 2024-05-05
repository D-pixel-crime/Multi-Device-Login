import mongoose, { Model } from "mongoose";

const devicesSchema = new mongoose.Schema({
  fullInfo: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  deviceType: String,
  deviceBrand: String,
  deviceModel: String,
  clientType: String,
  browserName: String,
  isLoggedIn: Boolean,
  lastLogin: Date,
});

const DevicesModel: Model<any> = mongoose.model("Devices", devicesSchema);

export default DevicesModel;
