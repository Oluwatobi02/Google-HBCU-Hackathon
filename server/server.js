// Initialize Express and MongoDB
const express = require('express');

const session = require('express-session');
const passport = require('passport');
const User = require('./user-model');
const bodyParser = require('body-parser');
require('./auth');


function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}


const app = express();
app.use(bodyParser.json());
app.use(session({ secret: "keyboard cat",
resave: false,
saveUninitialized: false, }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/login', (req, res) => {
    res.send('<a href="/auth/google">Login with Google</a>');
})

app.get('/auth/google',
passport.authenticate('google', { scope: ['email', 'profile']}) 
);

app.get('/google/callback', 
passport.authenticate('google', {
successRedirect: '/onboarding',
failureRedirect: '/auth/failure',
})
);

app.get('/auth/failure', (req, res) => {
    res.send('Failed to authenticate..')
})

app.get('/api/user', isLoggedIn, (req, res) => {
    if (req.user) {
        res.json(req.user);
    } else {
        res.status(401).json({ error: "Not logged in"});
    }
})

app.get('/logout', function(req, res) {
    req.logout( function(err) {
        if (err) {
            console.log(err);
        }
        res.redirect('/login');
    });
})






app.get('/onboarding', (req, res) => {
  // const { username, university, major, classification, country, international } = req.body;
google_id = "you are signed it" + req.user
console.log(google_id)
res.send(google_id)

  // try {
  //   // Check if the username already exists
  //   const existingUser = await User.findOne({ username: username });
  //   if (existingUser) {
  //     return res.status(400).json({ message: 'Username already exists' });

  //   }

  //   additionalInfo = {
  //     university: university,
  //     major: major,
  //     classification: classification,
  //     country: country,
  //     international: international
  //   }
  //   User.findOneAndUpdate({ google_id} , additionalInfo, {new: true}, (err, user) => {
  //     if (err) {
  //       res.status(500).json({ error: err.message });
  //     } else if (!user) {
  //       res.status(404).json({ message: 'User not found' });
  //     } else {
  //       res.send(user);
  //     }

  // })
  // } catch (err) {
  //   res.status(500).json({ error: err.message });
  // }
})








app.listen(5000, () => console.log('Server is running...'));