const express = require('express')
const session = require('express-session')
const passport = require('passport')
const GitHubStrategy = require('passport-github2').Strategy
const request = require('request')
const app = express();
const GitHubApi = require('node-github');
const axios = require('axios');

var github = new GitHubApi({
    // required
    version: "3.0.0",
    // optional
    debug: true,
    protocol: "https",
    host: "api.github.com", // should be api.github.com for GitHub
    timeout: 5000,
    headers: {
        "user-agent": "My-Cool-GitHub-App"
        // GitHub is happy with a unique user agent
    }
})


var requireAuth = function(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(403).end();
    }
    return next();
}

app.use(express.static(__dirname + '/public'));
app.use(session({
    secret: 'testing string',
    saveUninitialized: false,
    resave: false
}))

passport.use(new GitHubStrategy({
        clientID: '0a3018f2b089cd306f98',
        clientSecret: 'e7c9b21787023e87723d4713c3943eb0e5a5a6bc',
        callbackURL: "http://localhost:3000/auth/github/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        session.user = profile;
        session.user.token = accessToken;
        return done(null, profile);
    }
));

app.use(passport.initialize())
app.use(passport.session())

app.get('/api/user', function(req, res) {
    return res.status(200).json(user)
})

app.get('/auth/github', passport.authenticate('github', {
    scope: ['user:email']
}))

app.get('/auth/github/callback', passport.authenticate('github', {
        failureRedirect: '/login'
    }),
    function(req, res) {
        // successful authentication, redirect home
        res.redirect('/#!/home')
    })

app.get('/api/github/following', requireAuth, function(req, res, next) {
    var username = session.user.username;
    axios.request({
            url: `https://api.github.com/users/${username}/following`,
            headers: {
                'Authorization': `token ${session.user.token}`
            }
        })
        .then(function(result) {
            console.log(result);
            res.status(200).json(result.data);
        })
        .catch(function(err) {
            next(err);
        });
});

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

app.listen(3000, function() {
    console.log(`YOU ARE THE BOSS OF 3000`);
})
