import mongoose, { Model } from "mongoose";

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

const DevicesModel: Model<any> = mongoose.model("Devices", devicesSchema);

export default DevicesModel;
