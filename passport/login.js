const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bCrypt = require('bcrypt-nodejs');

module.exports = function(passport) {
    passport.use('login', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, username, password, done) {
            
            // Check in mongo if a user with the username exists
            User.findOne({ 'username': username },
                function(err, user) {
                    // In case of any error, return using the done method
                    if (err) {
                        return done(err);
                    }
                    
                    if (!user) {
                        console.log('User not found with username: ' + username);
                        return done(null, false, req.flash('message', 'User not found'));
                    }

                    // User exists but wrong password
                    if (!isValidPassword(user, password)) { 
                        console.log('Invalid password');
                        return done(null, false, req.flash('message', 'Invalid password'));
                    }

                    // Username and password both match, return user from done method
                    return done(null, user);
                }
            );
        })
    );
}

function isValidPassword(user, password) {
    return bCrypt.compareSync(password, user.password);
}