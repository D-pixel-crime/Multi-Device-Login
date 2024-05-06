import express from "express";
import passport from "passport";
import nodemailer from "nodemailer";
import VerificationOtp from "../schema/verificationOtp.js";
import bcrypt from "bcrypt";
import parser from "ua-parser-js";
import Devices from "../schema/devices.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_APP_PASSWORD,
  },
});

transporter.verify((error) => {
  if (error) {
    console.error(error);
  } else {
    console.log("Email server is ready");
  }
});

const router = express.Router();

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
    successRedirect: `${process.env.CLIENT_URL}/emailVerification/${Math.floor(
      Math.random() * 100000
    )}`,
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

    const info = await transporter.sendMail({
      from: {
        name: "Random Guy",
        address: process.env.SENDER_EMAIL!,
      },
      to: currentUser.email,
      subject: "Email Verification",
      html: `<h2>Your verification OTP is <strong>${randomOtp}</strong></h2>`,
    });

    console.log(info);

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
  const { input, otpDetails } = req.body;

  try {
    const verificationOtp = await VerificationOtp.findById(otpDetails._id);

    if (verificationOtp.expiry < new Date()) {
      await VerificationOtp.findByIdAndDelete(otpDetails._id);
      res.status(401).json({ error: true, message: "OTP expired" });
      return;
    }

    if (!verificationOtp) {
      res.status(404).json({
        message: "No OTP found. Please request a new OTP",
      });
      return;
    }

    const isMatch = await bcrypt.compare(input, verificationOtp.otp);

    if (!isMatch) {
      res.status(401).json({ message: "Incorrect OTP" });
      return;
    }

    res
      .status(200)
      .json({ isMatch: true, message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ error: true, message: "Failed to verify OTP" });
  }
});

router.get("/logout/:userId", async (req, res) => {
  const userId = req.params.userId;
  const parsedUserAgent = parser(req.headers["user-agent"]);

  try {
    await Devices.findOneAndUpdate(
      { fullInfo: parsedUserAgent, user: userId },
      { isLoggedIn: false }
    );
  } catch (error) {
    console.error(error);
  }
  req.logout((err: any) => {
    if (err) {
      console.error(err);
    }
  });
  res.redirect(process.env.CLIENT_URL!);
});

export { router };
