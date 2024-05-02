import express from "express";
import passport from "passport";
import "dotenv/config";
import "./utils/config/passportSetup.js";
import { connectToDatabase } from "./utils/DB/database.js";
import session from "express-session";
import cors from "cors";
connectToDatabase();
const app = express();
const PORT = process.env.PORT || 2000;
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
}));
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
app.get("/auth/login/success", (req, res) => {
    if (req.user) {
        res
            .status(200)
            .json({ error: false, message: "User logged in", user: req.user });
    }
    else {
        res.status(401).json({ error: true, message: "User not logged in" });
    }
});
app.get("/auth/login/failed", (req, res) => {
    res.status(401).json({ error: true, message: "Failed to log in" });
});
app.get("/auth/google/redirect", passport.authenticate("google", {
    successRedirect: `${process.env.CLIENT_URL}/profile`,
    failureRedirect: "/auth/login/failed",
}), (req, res) => {
    const user = req.user;
    res.status(200).json(user);
});
app.get("/auth/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error(err);
        }
    });
    res.redirect(process.env.CLIENT_URL);
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
