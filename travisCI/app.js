const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const moment = require('moment');
const config = require('./config');
const helmet = require('helmet');


var
    path = require('path'),
    passport = require('passport'),
    session = require('express-session'),
    cookieParser = require('cookie-parser'),
    logger = require('morgan'),
    cors = require('cors');
PORT = process.env.PORT || config.port;

// const api_sltxInventory = require('./routes/sltxInventory');
// app.use('/sltxInventory', api_sltxInventory);
app.use(function (req, res, next) {
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    
    // Pass to next layer of middleware
    next();
});
console.log("http://127.0.0.1:"+config.port+"/");

//Alex Prueba --------------------------------------------------------------------
require('./passport.js')(passport);


// app.use(logger('dev'));






app.use(express.static(path.join(__dirname)));
app.use(cookieParser());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    parameterLimit: 1000000,
    extended: false
}));
app.use(cors());
app.use(helmet())
app.use(session({
    secret: 'anything',
    resave: true,
    rolling: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());








const wrap = fn => (...args) => fn(...args).catch(args[2])











// we will call this to start the GitHub Login process
app.get('/auth/github', passport.authenticate('github', { scope: [ 'user:email', 'read:org', 'repo' ] }, {session: true}));

// GitHub will call this URL
app.get('/auth/github/callback', 
passport.authenticate('github', { failureRedirect: '/' }),
    function(req, res) {
        res.redirect('/');
    });
    
app.get('/', function (req, res) {
    var html = "<ul>\
      <li><a href='/auth/github'>GitHub</a></li>\
      <li><a href='/logout'>logout</a></li>\
      <li><a href='/travis'>tryWithToken</a></li>\
      <li><a href='/travis/getrepos'>tryGetrepos</a></li>\
      <li><a href='/travis/files'>tryFiles</a></li>\
    </ul>";

    // data fetched from github server
    if (req.isAuthenticated()) {
        html += "<p>authenticated as user:</p>"
      html += "<pre>" + JSON.stringify(req.user, null, 4) + "</pre>";
    }
    
    res.send(html);
});

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

// Simple route middleware to ensure user is authenticated.
//  Use this route middleware on any resource that needs to be protected.  If
//  the request is authenticated (typically via a persistent login session),
//  the request will proceed.  Otherwise, the user will be redirected to the login page.

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/')
}

app.get('/protected', ensureAuthenticated, function(req, res) {
    console.log('granted')
    res.send("acess granted");
});


const api_travis = require('./routes/travis');
app.use('/travis', api_travis)

module.exports = app;