import express from "express";
import passport from "passport";
import "dotenv/config";
import "./config/passportSetup.js";
import { connectToDatabase } from "./utils/database.js";
import session from "express-session";
connectToDatabase();
const app = express();
const PORT = 2000;
app.use(session({
    secret: "thisIsASecret",
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.get("/auth/google", passport.authenticate("google", { scope: ["profile"] }));
app.get("/auth/google/redirect", passport.authenticate("google", { failureMessage: "Failed to authenticate" }), (req, res) => {
    res.send("You have authenticated and reached the callback URL");
});
app.get("/", (req, res) => {
    const device = req.headers;
    console.log(device);
    res.send(`Hello World! I am being served from a random!`);
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
