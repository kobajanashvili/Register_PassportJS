const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){
	passport.use('signup', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, username, password, done) {     
            console.log('username: ' + username);
            
            // Find a user in Mongo with provided username
            User.findOne({ 'username' :  username }, function(err, user) {
                
                // In case of any error, return using the done method
                if (err) {
                    console.log('Error in SignUp: '+err);
                    return done(err);
                }
                                
                if (user) {
                    // User already exists
                    console.log('User already exists with username: ' + username);
                    return done(null, false, req.flash('message', 'User already exists'));
                } else {
                    // Create a new user
                    let newUser = new User();

                    // Set the user's local credentials
                    newUser.username = username;
                    newUser.password = createHash(password);
                    newUser.email = req.param('email');
                    newUser.firstName = req.param('firstName');
                    newUser.lastName = req.param('lastName');
                    newUser.isAdmin = false;

                    // save the user
                    newUser.save(function(err) {
                        if (err){
                            console.log('Error in Saving user: '+err);  
                            throw err;  
                        }
                        console.log('User Registration succesful');    
                        return done(null, newUser);
                    });
                }               
            });           
        })
    );
}

// Generates hash using bCrypt
function createHash(password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}