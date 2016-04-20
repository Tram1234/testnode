module.exports = function(app, passport) {
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });
    // app.post('/login', do all our passport stuff here);
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    app.post('/signup',passport.authenticate('local',{
        successRedirect:'/chat',
        failureRedirect : '/signup',
        failureFlash : true
    }));
    app.get('/chat', isLoggedIn, function(req, res) {
        res.render('chat.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
    function isLoggedIn(req, res, next) {


        if (req.isAuthenticated())
            return next();


        res.redirect('/');
    }

};