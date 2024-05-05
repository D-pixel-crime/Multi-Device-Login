var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from "axios";
import express from "express";
import Devices from "../schema/devices.js";
const router = express.Router();
router.get("/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    console.log(userId);
    const userAgent = req.headers["user-agent"];
    try {
        const deviceData = yield Devices.find({ user: userId });
        if (!deviceData) {
            res.status(404).json({ error: "No devices found for this user" });
        }
        const isAllReadyThere = deviceData.find((device) => device.fullInfo === userAgent);
        if (isAllReadyThere) {
            res.status(200).json({ allDevices: deviceData });
        }
        else {
            const { data } = yield axios.post("https://api.apicagent.com", { ua: userAgent }, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const thisDevice = yield Devices.create({
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
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
export { router };
