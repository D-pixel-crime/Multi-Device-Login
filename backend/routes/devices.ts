import axios from "axios";
import express from "express";
import Devices from "../schema/devices.js";
import { log } from "console";
import parser from "ua-parser-js";

const router = express.Router();

router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;
  const userAgent = req.headers["user-agent"];

  console.log(parser(userAgent));
  res.status(200).send("OK");
});

export { router };
