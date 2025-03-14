const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const { username, password } = req.body;
    
    // Check if both username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }
    
    // Check if the username already exists
    const userExists = users.find(user => user.username === username);
    
    if (userExists) {
        return res.status(409).json({ message: "Username already exists." });
    }
    
    // Register the new user
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully." });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const bookKeys = Object.keys(books);
  
    for (let key of bookKeys) {
      if (books[key].author === author) {
        return res.send(books[key]);
      }
    }
  
    // If no match is found
    return res.status(404).send({ message: "Author not found" });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const bookKeys = Object.keys(books);
  
    for (let key of bookKeys) {
      if (books[key].title === title) {
        return res.send(books[key]);
      }
    }
  
    // If no match is found
    return res.status(404).send({ message: "Book not found" });
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let book = books[isbn];
    res.send(JSON.stringify(book["reviews"],null,4));
});

module.exports.general = public_users;
