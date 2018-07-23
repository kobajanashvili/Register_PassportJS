const express = require('express');
const app = express(); 

const path = require('path');
const cookieParser = require('cookie-parser');
app.use(cookieParser());

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

const mongoose = require('mongoose');
const dbConfig = require('./db.js');
mongoose.connect(dbConfig.url, {useNewUrlParser: true });
console.log('connected to mongoDB');
const User = require('./models/user.js');

// Configuring passport
const passport = require('passport');
const session = require('express-session');
app.use(session({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

// Using the flash middleware provided by connect-flash to store messages in session
// and displaying in templates
const flash = require('connect-flash');
app.use(flash());

// Initialize passport
const initPassport = require('./passport/init');
initPassport(passport);

const routes = require('./routes/users')(passport);
app.use('/', routes);

// development error handler will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.listen(3000, console.log("server up on port 3000"));


