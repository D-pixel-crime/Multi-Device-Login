import axios from "axios";
import express from "express";
import Devices from "../schema/devices.js";
import { log } from "console";

const router = express.Router();

router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;
  console.log(userId);

  const userAgent = req.headers["user-agent"];

  try {
    const deviceData = await Devices.find({ user: userId });

    if (!deviceData) {
      res.status(404).json({ error: "No devices found for this user" });
    }

    const isAllReadyThere = deviceData.find(
      (device) => device.fullInfo === userAgent
    );

    if (isAllReadyThere) {
      res.status(200).json({ allDevices: deviceData });
    } else {
      const { data } = await axios.post(
        "https://api.apicagent.com",
        { ua: userAgent },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const thisDevice = await Devices.create({
        fullInfo: userAgent,
        user: userId,
        deviceType: data.device.type,
        deviceBrand: data.device.brand,
        deviceModel: data.device.model,
        clientType: data.client.type,
        browserName: data.client.name,
        isLoggedIn: true,
        lastLogin: new Date().toUTCString(),
      });

      res.status(200).json({ allDevices: [...deviceData, thisDevice] });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export { router };
