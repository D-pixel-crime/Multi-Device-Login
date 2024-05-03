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
const router = express.Router();
const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: false,
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD,
    },
});
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
    successRedirect: `${process.env.CLIENT_URL}/profile`,
    failureRedirect: "/login/failed",
}), (req, res) => {
    const user = req.user;
    res.status(200).json(user);
});
router.get("/mailVerification", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const randomOtp = Math.floor(1000 + Math.random() * 9000);
    const user = req.user;
    console.log(user);
    // try {
    //   await VerificationOtp.create({
    //     userId: user._id,
    //     otp: randomOtp,
    //     expiry: new Date(Date.now() + 60000),
    //   });
    //   await transporter.sendMail({
    //     from: process.env.SENDER_EMAIL,
    //     to: user.email,
    //     subject: "Email Verification",
    //     html: `<h2>Your verification OTP is <strong>${randomOtp}</strong></h2>`,
    //   });
    //   res.status(200).json({ error: false, message: "Verification email sent" });
    // } catch (error) {
    //   res.status(500).json({ error: true, message: "Failed to send email" });
    // }
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
