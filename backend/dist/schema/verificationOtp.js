import mongoose from "mongoose";
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
const VerificationOtpModel = mongoose.model("VerificationOtp", verificationOtpSchema);
export default VerificationOtpModel;
