let GitHubStrategy = require('passport-github2').Strategy,
    cred = require('./lib/oAuthCredentials.json'),
    Model = require('./postgresql/models/userControl.js');
    travisControl = require('./postgresql/controllers/travis.js');

module.exports = function (passport) {

    // console.log('passport - Inicia',GitHubStrategy.Strategy);

    passport.use(new GitHubStrategy({
        clientID: cred.CID,
        clientSecret: cred.CSt,
        callbackURL: 'http://127.0.0.1:3010/auth/github/callback'
      },
      async function(accessToken, refreshToken, profile, cb) {
          // console.log('AccesToken>>>>>>',accessToken)
          // console.log('refreshToken>>>>>>',refreshToken)
          // console.log('cb>>>>>>',cb)
          travisControl.TravisToken(accessToken).then(function(data){
            profile.travisToken = data;
            profile.token = accessToken;
            // console.log('profile', profile)
            return(cb(null, profile));
          });
        // User.findOrCreate({ githubId: profile.id }, function (err, user) {
        //     console.log('aquiiiiiii')
        //   return cb(err, user);
        // });
        
      }
    ));

    passport.serializeUser(function (user, cb) {
      // console.log('serialize', user);
        cb(null, user);
    });

    passport.deserializeUser(function (obj, cb) {
        // console.log('-- deserializeUser --');
            cb(null, obj);
    });

}
