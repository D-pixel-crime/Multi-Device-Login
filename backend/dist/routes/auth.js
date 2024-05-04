var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import passport from "passport";
import nodemailer from "nodemailer";
import VerificationOtp from "../schema/verificationOtp.js";
import bcrypt from "bcrypt";
const router = express.Router();
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/login/success", (req, res) => {
    if (req.user) {
        res
            .status(200)
            .json({ error: false, message: "User logged in", user: req.user });
    }
    else {
        res.status(401).json({ error: true, message: "User not logged in" });
    }
});
router.get("/login/failed", (req, res) => {
    res.status(401).json({ error: true, message: "Failed to log in" });
});
router.get("/google/redirect", passport.authenticate("google", {
    successRedirect: `${process.env.CLIENT_URL}/emailVerification/${Math.floor(Math.random() * 100000)}`,
    failureRedirect: "/login/failed",
}), (req, res) => {
    const user = req.user;
    res.status(200).json(user);
});
router.post("/mailVerification", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const randomOtp = Math.floor(1000 + Math.random() * 9000);
    const hashedOtp = yield bcrypt.hash(randomOtp.toString(), 10);
    const { currentUser } = req.body;
    const testAccount = yield nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
            user: "clemmie.ryan31@ethereal.email",
            pass: "6nK88ynwNfYVgQQ4jF",
        },
    });
    transporter.verify((error) => {
        if (error) {
            console.error(error);
        }
        else {
            console.log("Email server is ready");
        }
    });
    try {
        const otpDetails = yield VerificationOtp.create({
            userId: currentUser._id,
            otp: hashedOtp,
            expiry: new Date(Date.now() + 60000),
        });
        yield transporter.sendMail({
            from: '"Fred Foo 👻" <clemmie.ryan31@ethereal.email>',
            to: currentUser.email,
            subject: "Email Verification",
            html: `<h2>Your verification OTP is <strong>${randomOtp}</strong></h2>`,
        });
        res.status(200).json({
            otpDetails: otpDetails,
            error: false,
            message: "Email sent successfully",
        });
    }
    catch (error) {
        res.status(500).json({ error: true, message: "Failed to send email" });
    }
}));
router.post("/verifyOtp", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { input, otpDetails } = req.body;
    try {
        const verificationOtp = yield VerificationOtp.findById(otpDetails._id);
        if (verificationOtp.expiry < new Date()) {
            yield VerificationOtp.findByIdAndDelete(otpDetails._id);
            res.status(401).json({ error: true, message: "OTP expired" });
            return;
        }
        if (!verificationOtp) {
            res.status(404).json({
                message: "No OTP found. Please request a new OTP",
            });
            return;
        }
        const isMatch = yield bcrypt.compare(input, verificationOtp.otp);
        if (!isMatch) {
            res.status(401).json({ message: "Incorrect OTP" });
            return;
        }
        res.redirect(`${process.env.CLIENT_URL}/profile`);
    }
    catch (error) {
        res.status(500).json({ error: true, message: "Failed to verify OTP" });
    }
}));
router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error(err);
        }
    });
    res.redirect(process.env.CLIENT_URL);
});
export { router };
