require('dotenv').config();
const User = require('./user-model');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env['GOOGLE_CLIENT_ID'],
    clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
    callbackURL: 'http://localhost:3000/google/callback',
    passReqToCallback: true,
  },
  async function(request, accessToken, refreshToken, profile, done) {
    const firstName = profile.name.givenName;
    const lastName = profile.name.familyName;
    const email = profile.emails[0].value;
  
    try {
        let user = await User.findOne({ googleId: profile.id });
  
        if (user) {
          // If the user exists, return the user
          return done(null, {...user._doc, isNewUser: false });
        } else {
          // If the user does not exist, create a new user
          const newUser = new User({
            googleId: profile.id,
            firstName: firstName,
            lastName: lastName,
            email: email,
            university: '',
            major: '',
            classification: '',
            country: '',
            international: '',
            description: '',
            connections: [],
            connectionRequests: [],
          });
          user = await newUser.save();
          return done(null, {...user._doc, isNewUser: true });
        }
      } catch (err) {
        return done(err);
      }


  }
))
passport.serializeUser(function(user, done) {
    done(null, user);
  });
passport.deserializeUser(function(user, done) {
    done(null, user);
  });