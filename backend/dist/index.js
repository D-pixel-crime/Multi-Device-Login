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
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.get("/auth/google", passport.authenticate("google", { scope: ["profile"] }));
app.get("/auth/google/redirect", passport.authenticate("google", { failureMessage: "Failed to authenticate" }), (req, res) => {
    const user = req.user;
    res.status(200).json(user);
    // res.send("You have authenticated and reached the callback URL");
});
app.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error(err);
        }
    });
    res.redirect("/auth/google");
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
