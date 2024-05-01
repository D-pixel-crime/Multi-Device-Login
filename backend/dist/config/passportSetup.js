var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../schema/user.js";
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    callbackURL: "/auth/google/redirect",
}, (accessToken, refreshToke, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Callback function fired");
    console.log(profile);
    try {
        const user = yield User.findOne({ googleId: profile.id });
        if (user) {
            console.log("User already exists in the database");
            done(null, user);
            return;
        }
        const newUser = yield User.create({
            name: profile.displayName,
            googleId: profile.id,
            photo: profile.photos[0].value,
        });
        console.log("New user created", newUser);
        done(null, newUser);
        return;
    }
    catch (error) {
        console.error(error);
        done(error, undefined);
        return;
    }
})));
