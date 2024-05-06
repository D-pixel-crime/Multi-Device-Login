import axios from "axios";
import express from "express";
import Devices from "../schema/devices.js";
import { log } from "console";
import parser from "ua-parser-js";

const router = express.Router();

router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;
  const userAgent = req.headers["user-agent"];

  try {
    const deviceInfo = parser(userAgent);

    const isAlreadyThere = await Devices.findOne(
      { fullInfo: deviceInfo },
      { user: userId }
    );

    if (isAlreadyThere) {
      await Devices.findByIdAndUpdate(isAlreadyThere._id, {
        isLoggedIn: true,
        lastLoggedIn: new Date().toUTCString(),
      });
    } else {
      await Devices.create({
        fullInfo: deviceInfo,
        user: userId,
        isLoggedIn: true,
        lastLoggedIn: new Date().toUTCString(),
      });
    }

    const devices = await Devices.find({ user: userId });

    res.status(200).json({ allDevices: devices });
  } catch (error) {
    log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export { router };
