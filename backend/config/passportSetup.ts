import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../schema/user.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_OAUTH_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
      callbackURL: "/auth/google/redirect",
    },
    async (accessToken, refreshToke, profile, done) => {
      console.log("Callback function fired");
      console.log(profile);

      try {
        const user = await User.findOne({ googleId: profile.id });

        if (user) {
          console.log("User already exists in the database");
          done(null, user);
          return;
        }

        const newUser: any = await User.create({
          name: profile.displayName,
          googleId: profile.id,
          photo: profile.photos![0].value,
        });

        console.log("New user created", newUser);

        done(null, newUser);
        return;
      } catch (error: any) {
        console.error(error);
        done(error, undefined);
        return;
      }
    }
  )
);
