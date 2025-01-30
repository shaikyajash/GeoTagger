const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const User = require("../models/user"); // Adjust path to your user model

// Custom cookie extractor if we want to extracr from the cookie in Future
const cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["token"]; // Extract the token from the "token" cookie
  }
  return token;
};

const opts = {
  // jwtFromRequest: cookieExtractor, // Use the custom cookie extractor

  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract JWT from the Authorization header
  secretOrKey: "secrethaibhai",
};

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opts, async (jwtPayload, done) => {
      try {
        // Find user by ID from token payload
        const user = await User.findById(jwtPayload.id);
        if (user) {
          return done(null, user); // Pass user to req.user
        } else {
          return done(null, false); // No user found
        }
      } catch (err) {
        return done(err, false); // Handle error
      }
    })
  );
};
