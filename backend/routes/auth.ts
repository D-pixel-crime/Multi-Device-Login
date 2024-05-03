import express from "express";
import passport from "passport";
import nodemailer from "nodemailer";
import VerificationOtp from "../schema/verificationOtp.js";
import bcrypt from "bcrypt";

const router = express.Router();
const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: false,
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_PASSWORD,
  },
});

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/login/success", (req, res) => {
  if (req.user) {
    res
      .status(200)
      .json({ error: false, message: "User logged in", user: req.user });
  } else {
    res.status(401).json({ error: true, message: "User not logged in" });
  }
});

router.get("/login/failed", (req, res) => {
  res.status(401).json({ error: true, message: "Failed to log in" });
});

router.get(
  "/google/redirect",
  passport.authenticate("google", {
    successRedirect: `${process.env.CLIENT_URL}/profile`,
    failureRedirect: "/login/failed",
  }),
  (req, res) => {
    const user = req.user;

    res.status(200).json(user);
  }
);

router.post("/mailVerification", async (req, res) => {
  const randomOtp = Math.floor(1000 + Math.random() * 9000);
  const hashedOtp = await bcrypt.hash(randomOtp.toString(), 10);
  const { currentUser } = req.body;

  try {
    const otpDetails = await VerificationOtp.create({
      userId: currentUser._id,
      otp: hashedOtp,
      expiry: new Date(Date.now() + 60000),
    });

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: currentUser.email,
      subject: "Email Verification",
      html: `<h2>Your verification OTP is <strong>${randomOtp}</strong></h2>`,
    });

    res.status(200).json({
      otpDetails: otpDetails,
      error: false,
      message: "Email sent successfully",
    });
  } catch (error) {
    res.status(500).json({ error: true, message: "Failed to send email" });
  }
});

router.post("/verifyOtp", async (req, res) => {
  const { input, otpId } = req.body;
  const user = req.user;

  try {
    const verificationOtp = await VerificationOtp.findById(otpId);

    if (!verificationOtp) {
      res.status(404).json({
        error: true,
        message: "No OTP found. Please request a new OTP",
      });
      return;
    }

    const isMatch = await bcrypt.compare(input, verificationOtp.otp);

    if (!isMatch) {
      res.status(401).json({ error: true, message: "Incorrect OTP" });
      return;
    }

    if (verificationOtp.expiry < new Date()) {
      await VerificationOtp.findByIdAndDelete(otpId);
      res.status(401).json({ error: true, message: "OTP expired" });
      return;
    }

    res.status(200).json({ error: false, message: "OTP verified" });
  } catch (error) {
    res.status(500).json({ error: true, message: "Failed to verify OTP" });
  }
});

router.get("/logout", (req, res) => {
  req.logout((err: any) => {
    if (err) {
      console.error(err);
    }
  });
  res.redirect(process.env.CLIENT_URL!);
});

export { router };