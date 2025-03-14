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

const axios = require('axios');

// Task 10: Get the list of books available
async function getBooks() {
  try {
    const response = await axios.get('http://localhost:5000/');
    console.log(response.data);
  } catch (error) {
    console.error("Error fetching book list:", error);
  }
}

// Call the function
getBooks();

// Task 11: Get book details based on ISBN
async function getBookDetailsByISBN(isbn) {
    try {
      const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
      console.log(response.data);
    } catch (error) {
      console.error(`Error fetching book with ISBN ${isbn}:`, error);
    }
  }
  
  // Call the function with an example ISBN
  getBookDetailsByISBN('10');
  

// Task 12: Get book details based on author
async function getBooksByAuthor(author) {
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    console.log(response.data);
  } catch (error) {
    console.error(`Error fetching books by author ${author}:`, error);
  }
}

// Call the function with an example author
getBooksByAuthor('Unknown');

// Task 13: Get book details based on title
async function getBooksByTitle(title) {
    try {
      const response = await axios.get(`http://localhost:5000/title/${title}`);
      console.log(response.data);
    } catch (error) {
      console.error(`Error fetching book with title ${title}:`, error);
    }
  }
  
  // Call the function with an example title
  getBooksByTitle('Harry Potter');
  

module.exports.general = public_users;
