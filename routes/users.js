const express = require('express');
const router = express.Router();

module.exports = function(passport) {

	// GET login page
	router.get('/login', function(req, res) {
    	// Display the Login page with any error message, if any
		res.render('login', { message: req.flash('message') });
	});

	// Handle Login POST
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/home',
        failureRedirect: '/login',       
		failureFlash: true  
	}));

	// GET Registration Page
	router.get('/signup', function(req, res) {
		res.render('register', { message: req.flash('message') });
	});

	// Handle Registration POST 
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/home',
		failureRedirect: '/signup',
		failureFlash: true  
	}));

	// GET Home Page 
	router.get('/home', isAuthenticated, function(req, res){
		res.render('home', { user: req.user });
	});

	// Handle Logout 
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/login');
	});

	return router;
}

function isAuthenticated(req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object
	if (req.isAuthenticated())
        return next();
        
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/login');
}