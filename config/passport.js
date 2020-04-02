const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const keys = require('./keys');
const UserModel = require('../models/User');

//Options to save token related info
const opts= {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {   
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        console.log(jwt_payload);

        //verify if JWT token is valid
        UserModel.findById(jwt_payload.id)
         .then(user => {
             if(user)
             {
                 return done(null, user);
             }
             else{
                 return done(null, false);
             }
         })
         .catch(err => console.log(err))

    }))
}