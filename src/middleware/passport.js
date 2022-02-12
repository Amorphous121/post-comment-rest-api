const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const { User } = require('../models');
const { appConfig } = require('../config');

passport.use(
  'local',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) return done(null, false, { message: "User doesn't exits." });

        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword)
          return done(null, false, { message: 'Invalid credentials.' });

        return done(null, user, { message: 'User logged in successfully.' });
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  'jwt',
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: appConfig.jwtTokenSecret,
    },
    async (token, done) => {
      const isUserExists = await User.exists({
        _id: token.user._id,
      });
      if (!isUserExists)
        return done(null, false, { message: 'Invalid Token.' });
      return done(null, token.user);
    }
  )
);
