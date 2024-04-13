const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;
const mongoURI = 'mongodb://localhost:27017/garbgalaxy'; // Assuming your database name is sancturyy

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB', err));

// Define MongoDB schema for user
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  password: { type: String, required: true }
});

// Define Mongoose model for user
const User = mongoose.model('User', userSchema);

// Define MongoDB schema for review
const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  rating: { type: Number, required: true },
  review: { type: String, required: true }
});

// Define Mongoose model for review
const Review = mongoose.model('Review', reviewSchema);

// Middleware to parse JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the login HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Route to handle user registration
app.post('/register', async (req, res) => {
  try {
    // Create a new User document
    const newUser = new User({
      username: req.body.newUsername,
      email: req.body.newEmail,
      phone: req.body.newPhone,
      password: req.body.newPassword
    });
    await newUser.save();
    res.redirect('/index.html'); // Redirect to prjct.html after registration
  } catch (err) {
    console.error('Error registering user', err);
    res.status(500).send('Internal server error');
  }
});

// Route to handle user login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Find user by username and password
    const user = await User.findOne({ username, password });
    if (user) {
      // User found, redirect to prjct.html
      res.redirect('/index.html');
    } else {
      // User not found or password incorrect, redirect back to login page
      res.redirect('/');
    }
  } catch (err) {
    console.error('Error logging in user', err);
    res.status(500).send('Internal server error');
  }
});

// Route to handle form submissions (review)
app.post('/review', async (req, res) => {
  try {
    // Create a new Review document
    const newReview = new Review({
      name: req.body.name,
      email: req.body.email,
      rating: req.body.rating,
      review: req.body.review
    });
    await newReview.save();
    res.redirect('/index.html'); // Redirect to prjct.html or wherever after submission
  } catch (err) {
    console.error('Error submitting review', err);
    res.status(500).send('Internal server error');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
