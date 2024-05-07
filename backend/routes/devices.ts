import axios from "axios";
import express from "express";
import Devices from "../schema/devices.js";
import parser from "ua-parser-js";

const router = express.Router();

router.get("/:userId/:deviceId", async (req, res) => {
  const userId = req.params.userId;
  const deviceId = req.params.deviceId;

  try {
    await Devices.findByIdAndUpdate(
      {
        _id: deviceId,
      },
      {
        lastLoggedIn: new Date().toLocaleString(),
      }
    );

    const allDevices = await Devices.find({ user: userId });

    res.status(200).json({ allDevices });
  } catch (error) {
    res.status(500).json({ error: true, message: "Failed to update device" });
  }
});

router.get("/:userId/new", async (req, res) => {
  const userId = req.params.userId;
  const parseUserAgent = parser(req.headers["user-agent"]);
  const ipAddress = req.ip;

  try {
    await Devices.create({
      fullInfo: parseUserAgent,
      ipAddress,
      user: userId,
      isLoggedIn: true,
      lastLoggedIn: new Date().toLocaleString(),
    });

    const allDevices = await Devices.find({ user: userId });

    res.status(200).json({ allDevices });
  } catch (error) {
    res.status(500).json({ error: true, message: "Failed to add device" });
  }
});

export { router };
