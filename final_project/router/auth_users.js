const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

const JWT_SECRET = "test123secretkey"; // Dummy secret key

let users = []; // Empty list of users

// Check if username is valid (not already taken)
const isValid = (username) => {
  return !users.some(user => user.username === username);
};

// Check if username and password match
const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

// Login - Authenticate user and create JWT token
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  // Check if the user exists and password matches
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ message: "Invalid login. Check username or password." });
  }

  // Create JWT token
  const accessToken = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });

  return res.status(200).json({ message: "Login successful", token: accessToken });
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;

  if (!review) {
    return res.status(400).json({ message: "Review content is required." });
  }

  // ✅ Get token from Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Missing Authorization header" });
  }

  const token = authHeader.split(" ")[1];
  let username;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    username = decoded.username;
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }

  // Find book by ISBN
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }

  // Add/Update the review
  if (!book.reviews) {
    book.reviews = {};
  }

  book.reviews[username] = review;

  return res.status(200).json({
    message: "Review added/updated successfully.",
    reviews: book.reviews
  });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  // ✅ Get token from Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Missing Authorization header" });
  }

  const token = authHeader.split(" ")[1];
  let username;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    username = decoded.username;
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }

  // Find book by ISBN
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }

  // Check if the user has posted a review
  if (!book.reviews || !book.reviews[username]) {
    return res.status(400).json({ message: "Review not found for this user." });
  }

  // Delete the review
  delete book.reviews[username];

  return res.status(200).json({
    message: "Review deleted successfully.",
    reviews: book.reviews
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
