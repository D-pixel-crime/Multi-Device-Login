import mongoose, { Model } from "mongoose";

const verificationOtpSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  otp: {
    type: String,
    required: true,
  },
  expiry: {
    type: Date,
    required: true,
  },
});

const VerificationOtpModel: Model<any> = mongoose.model(
  "VerificationOtp",
  verificationOtpSchema
);

export default VerificationOtpModel;
