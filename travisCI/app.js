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
    // cookieSession = require('cookie-session'),
    logger = require('morgan'),
    cors = require('cors');
PORT = process.env.PORT || config.port;

// const api_sltxInventory = require('./routes/sltxInventory');
// app.use('/sltxInventory', api_sltxInventory);
app.use(function (req, res, next) {
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept, authorization');
    
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:4200, http://127.0.0.1:3010, https://github.com/');
    
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

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





app.use(cors());
app.use(cookieParser());

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    parameterLimit: 1000000,
    extended: false
}));


app.use(express.static(path.join(__dirname)));
app.use(session({
    secret: 'anything',
    resave: true,
    saveUninitialized: true,
    cookie: {
        expires: 300000
    }
}));

// app.use(cookieSession({
//     name: 'session',
//     secret:'secret',
//         httpOnly:true
//   }))

// app.use(
//     cookieSession({
//         name:'session', //name of the cookie containing access token in the //browser
//         secret:'secret',
//         httpOnly:true
//         }))
app.use(helmet())
app.use(passport.initialize());
app.use(passport.session());








const wrap = fn => (...args) => fn(...args).catch(args[2])

    
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
const api_auth = require('./routes/auth');
app.use('/travis', api_travis)
app.use('/auth', api_auth)

module.exports = app;