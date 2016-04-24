
var LocalStrategy  = require('passport-local').Strategy;


var User   = require('../app/models/user');


module.exports = function(passport) {


    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });



    passport.use('local-signup', new LocalStrategy({

            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true
        },
        function(req, username, password, done) {


            process.nextTick(function() {

                // find a user whose username is the same as the forms username

                User.findOne({ 'local.username' :  username }, function(err, user) {

                    if (err)
                        return done(err);


                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                    } else {


                        // create the user
                        var newUser      = new User();

                        // set the user credentials in db
                        newUser.local.username  = username;
                        newUser.local.password = newUser.generateHash(password);

                        // save the user
                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }

                });

            });

        }));
    passport.use('local-login', new LocalStrategy({

            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true

        },
        // login check
        function(req,username, password, done) {
            console.log('form here');

            User.findOne({ 'local.username' :  username }, function(err, user) {

                if (err)
                    return done(err);


                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.'));


                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

                return done(null, user);
            });

        }));

};
