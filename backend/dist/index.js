import express from "express";
import passport from "passport";
import "dotenv/config";
import "./utils/config/passportSetup.js";
import { connectToDatabase } from "./utils/DB/database.js";
import session from "express-session";
import cors from "cors";
import { router as authRoutes } from "./routes/auth.js";
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
app.use("/auth", authRoutes);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
