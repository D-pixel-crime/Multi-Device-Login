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
import Devices from "../schema/devices.js";
import parser from "ua-parser-js";
const router = express.Router();
router.get("/:userId/:deviceId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const deviceId = req.params.deviceId;
    try {
        yield Devices.findByIdAndUpdate({
            _id: deviceId,
        }, {
            lastLoggedIn: new Date().toLocaleString(),
        });
        const allDevices = yield Devices.find({ user: userId });
        res.status(200).json({ allDevices });
    }
    catch (error) {
        res.status(500).json({ error: true, message: "Failed to update device" });
    }
}));
router.get("/:userId/new", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const parseUserAgent = parser(req.headers["user-agent"]);
    const ipAddress = req.ip;
    try {
        const newDevice = yield Devices.create({
            fullInfo: parseUserAgent,
            ipAddress,
            user: userId,
            isLoggedIn: true,
            lastLoggedIn: new Date().toLocaleString(),
        });
        const allDevices = yield Devices.find({ user: userId });
        res.status(200).json({ allDevices, newDevice });
    }
    catch (error) {
        res.status(500).json({ error: true, message: "Failed to add device" });
    }
}));
export { router };
