// Initialize Express and MongoDB
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const User = require('./user-model');
const bodyParser = require('body-parser');
require('./auth');


function isLoggedIn(req, res, next) {
    req.isAuthenticated() ? next() : res.sendStatus(401);
}


const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:5000', // replace with your actual frontend's origin
    credentials: true
}));
app.use(session({ secret: "keyboard cat",
resave: false,
saveUninitialized: false, }));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get('/auth/google',
passport.authenticate('google', { 
                                  scope: ['email', 'profile'],
                                  prompt: 'select_account'
                                }) 
);

app.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/auth/failure' }),
  function(req, res) {
    if (req.user.isNewUser) {
      res.redirect('http://localhost:5000/onboarding');
    } else {
      res.redirect('/feed');
    }
  }
);
app.get('/auth/failure', (req, res) => {
    res.send('Failed to authenticate..')
})

app.get('/api/user', isLoggedIn, (req, res) => {
    const googleId = req.user.googleId
    async function findUser() {
    try {
        const user = await User.findOne({ googleId: googleId });
        if (!user) {
          console.log('No user found with this google id');
        } else {
            res.json(user)
        }
      } catch (err) {
        console.error('An error occurred:', err);
      }}
      findUser()
})

app.get('/logout', function(req, res) {
  req.logout( (() => {
    req.session.destroy(err => {
      // if (err) {
      //   return res.sendStatus(500);
      // }
      res.clearCookie('connect.sid')
      res.sendStatus(200);
    });
  }));
})





app.post('/api/onboarding', async (req, res) => {
  try {
    // Get the current user from the session
    const user = await User.findOne({ googleId: req.user.googleId });
    console.log(req.body)

    // If the user is not found, send an error message
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's information with the form data
    user.university = req.body.university;
    user.major = req.body.major;
    user.classification = req.body.classification;
    user.country = req.body.country;
    user.international = req.body.international;
    user.description = req.body.description;

    // Save the updated user
    await user.save();

    // Send a response
    res.redirect('http://localhost:5000/mentors')
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred' });
  }
});


app.get('/feed', (req, res) => {
  res.redirect('http://localhost:5000/mentors')
    
})


app.get('/all-users', async (req, res) => {
  const users = await User.find({googleId: {$ne: googleId}})
    
  res.json(users)
})

app.get('/international-users', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).send('Unauthorized');
    }

    const googleId = req.user.googleId;
    const users = await User.find({international: 'Yes', googleId: {$ne: googleId}});
    const filteredUsers = users.find({
      googleId: { $nin: req.user.connectionsSent }
    })
    res.json(filteredUsers);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
})

app.get('/non-international-users', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).send('Unauthorized');
    }

    const googleId = req.user.googleId;
    const users = await User.find({international: 'No', googleId: {$ne: googleId}});
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


app.get('/connections', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).send('Unauthorized');
    }

    const googleId = req.user.googleId;
    const user = await User.findOne({ googleId: googleId });
    const connections = await User.find({ googleId: { $in: user.connections } }); 
    res.json(connections);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});





app.post('/sendconnectionrequest', async (req, res) => {
  try {
    const { userId, otherUserId } = req.body;

    // Find the user with the userId and add the otherUserId to their connectionRequests array
    await User.updateOne(
      { googleId: otherUserId },
      { $push: { connectionRequests: userId } }
    );
    await User.updateOne(
      { googleId: userId },
      { $push: { connectionsSent: otherUserId } }
    )
    res.json({ message: 'Connection request sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/acceptConnectionRequest', async (req, res) => {
  try {
    const { userId, otherUserId } = req.body;

    // Find the user with the userId, remove the otherUserId from their connectionRequests array, and add it to their matches array
    await User.updateOne(
      { googleId: userId },
      { $pull: { connectionRequests: otherUserId }, $push: { connections: otherUserId } }
    );

    // Find the user with the otherUserId and add the userId to their matches array
    await User.updateOne(
      { googleId: otherUserId },
      { $push: { connections: userId } }
    );

    res.send('Connection request accepted');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});























app.listen(3000, () => console.log('Server is running...'));