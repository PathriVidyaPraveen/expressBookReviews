const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  // Check if username or password is missing
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  // Check if username already exists
  if (users.some(user => user.username === username)) {
    return res.status(409).json({ message: "Username already exists. Please choose a different username." });
  }

  // If validation passes, add new user
  users.push({ username: username, password: password });

  return res.status(201).json({ message: "User registered successfully." });
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.status(200).send(JSON.stringify(books,null,4));
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if(books[isbn]){
    res.status(200).json(books[isbn]);
  }else{
    res.status(404).json({message: "Book not found for the given ISBN"})
  }
  return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const authorName = req.params.author.toLowerCase(); // get author param, case-insensitive match
  const booksByAuthor = [];

  // Get all ISBN keys from books object
  const bookKeys = Object.keys(books);

  // Iterate over each book
  bookKeys.forEach((isbn) => {
    const book = books[isbn];
    // Compare author names case-insensitively
    if (book.author.toLowerCase() === authorName) {
      booksByAuthor.push({ isbn: isbn, ...book });
    }
  });

  if (booksByAuthor.length > 0) {
    return res.status(200).json(booksByAuthor);
  } else {
    return res.status(404).json({ message: "No books found by this author" });
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const titleName = req.params.title.toLowerCase(); // get author param, case-insensitive match
  const booksByTitle = [];

  // Get all ISBN keys from books object
  const bookKeys = Object.keys(books);

  // Iterate over each book
  bookKeys.forEach((isbn) => {
    const book = books[isbn];
    // Compare author names case-insensitively
    if (book.title.toLowerCase() === titleName) {
      booksByTitle.push({ isbn: isbn, ...book });
    }
  });

  if (booksByTitle.length > 0) {
    return res.status(200).json(booksByTitle);
  } else {
    return res.status(404).json({ message: "No books found by this title" });
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if(books[isbn]){
    res.status(200).json(books[isbn].reviews);
  }else{
    res.status(404).json({message: "Book not found for the given ISBN"})
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
