const mongoose = require('mongoose');
const uri = 'mongodb+srv://tobi:a0IjefLpFm3zArJR@cluster1.qi2bhk9.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log('Connected to the database');
})
.catch((err) => {
    console.log(err);
})
const UserSchema = new mongoose.Schema({
    googleId: String,
    firstName: String,
    lastName: String,
    email: String,
    university: String,
    major: String,
    classification: String,
    country: String,
    international: String,
    connections: Array,
    description: String,
    connectionRequests: Array,
    
});

module.exports = mongoose.model('User', UserSchema, 'users');