const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const db = require("../models");

// Telling passport we want to use a Local Strategy. In other words, we want login with a username/email and password
passport.use(
  new LocalStrategy(
    // Our user will sign in using an email, rather than a "username"
    {
      usernameField: "email"
    },
    function(user, password, done) {
      // When a user tries to sign in this code runs
      const criteria = { email: user };
      db.User.findOne({
        where: criteria
      }).then(function(dbUser) {
        // If there's no user with the given email
        if (!dbUser) {
          console.log("Incorrect email address");
          return done(null, false, {
            message: "Incorrect email address."
          });
        }
        // If there is a user with the given email, but the password the user gives us is incorrect
        else if (!dbUser.validPassword(password)) {
          console.log("Incorrect password");
          return done(null, false, {
            message: "Incorrect password."
          });
        }
        // If none of the above, return the user
        console.log("Login successful");
        return done(null, dbUser);
      });
    }
  )
);

// In order to help keep authentication state across HTTP requests,
// Sequelize needs to serialize and deserialize the user
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

// Exporting our configured passport
module.exports = passport;
