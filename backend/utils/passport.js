import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GithubStrategy } from "passport-github2";
import User from "../models/user.models.js";

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL}/api/users/google/callback`,
    scope: ["profile", "email"]
},

    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ email: profile.emails[0].value });
            
            const name = profile.displayName || profile.username || "User";


            if (!user) {
                user = await User.create({
                    userName: name,
                    email: profile.emails[0].value,
                    isVerified: true,
                    profile_url : `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4F46E5&color=fff&size=150`,
                    googleId: profile.id,
                    age: 0,
                    collegeName: "",
                    languagesProficient: [],
                    targetingCompanies: []
                });
            }

            return done(null, user);

        } catch (error) {
            return done(error, null);
        }
    }
));


passport.use(new GithubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL}/api/users/github/callback`,
    scope : ['user:email']
},

    async(accessToken , refreshToken , profile , done) =>{
        try {
            let email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;

            if (!email) {
                email = `${profile.username || profile.id}@github.generated.com`;
            }

            let user = await User.findOne({ email : email });

            const name = profile.displayName || profile.username || "User";

            
            if(!user){
                user = await User.create({
                    userName : name,
                    email : email ,
                    isVerified : true,
                    profile_url : `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4F46E5&color=fff&size=150`,
                    githubId : profile.id,
                    age : 0,
                    collegeName : "",
                    languagesProficient : [],
                    targetingCompanies : []
                });
            }

            return done(null,user);

        } catch (error) {
            return done(error,null);
        }
    }


));


