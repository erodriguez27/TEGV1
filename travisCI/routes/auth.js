const express = require("express");
const passport = require('passport');
const session = require('express-session');
const api_auth = express.Router();

api_auth.get('/github', function authenticateGithub(req, res, next) {
    const rPath = req.header('referer').split('/'),
        pathRet = `${rPath[0]}//${rPath[2]}/${req.query.success}`;

    if (!req.isAuthenticated()) {

        session.returnTo = pathRet;

        next();
    } else {
        res.redirect(pathRet);
    }
}, passport.authenticate('github', { scope: ['user:email', 'read:org', 'repo'] }, { session: true }));

api_auth.get('/loggedIn', function (req, res) {
    console.log('in loggedIn', req.connection.remoteaddress)
    console.log(req.isAuthenticated(), req.user);
    res.status(200).json({
        statusCode: 200,
        logged: req.isAuthenticated(),
        user: req.user
    });
});

// GitHub will call this URL
api_auth.get('/github/callback', passport.authenticate('github', { successRedirect: session.returnTo, failureRedirect: '/' }),
    function (req, res) {
        console.log(session.returnTo)
        res.redirect(session.returnTo);
    });

api_auth.get('/logout', function (req, res) {
    console.log('llegue')
    req.logout();
    const redirectTo = req.isAuthenticated() ? `${req.query.origin}` : 'home';
    // res.setHeader('location', 'http://127.0.0.1:4200/home');
    // res.sendStatus(302);
    // res.redirect('http://127.0.0.1:4200/home');
    res.status(200).json({
        statusCode: 200,
        loggedOut: !req.isAuthenticated(),
        redirectTo: redirectTo
    });
});


module.exports = api_auth;