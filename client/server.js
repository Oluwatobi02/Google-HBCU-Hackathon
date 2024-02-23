const express = require('express');
const path = require('path');

const app = express();
// Serve static files from the public directory

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/landing.html'))
})

app.get('/onboarding', (req, res) => {
    res.sendFile(path.join(__dirname, '/onboarding.html'))
})

app.get('/dashboard', (req, res) => {
    res.send('Dashboard')
})
app.use(express.static(path.join(__dirname, '../client')));
app.listen(5000, () => console.log('Frontend server listening on port 5000'));