const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');

const public_users = express.Router();

// Register new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  if (users.some(user => user.username === username)) {
    return res.status(409).json({ message: "Username already exists. Please choose a different username." });
  }

  users.push({ username: username, password: password });

  return res.status(201).json({ message: "User registered successfully." });
});

// Get all books
public_users.get('/', (req, res) => {
  return res.status(200).json(books);
});
public_users.get('/books-async', async (req, res) => {
    try {
      const response = await axios.get('http://localhost:5000/');
      return res.status(200).json(response.data);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch books", error: error.message });
    }
  });
// Get book details by ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({ message: "Book not found for the given ISBN" });
  }
});

public_users.get('/isbn-async/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
  
    try {
      const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
      return res.status(200).json(response.data);
    } catch (error) {
      return res.status(404).json({ message: "Book not found using Axios", error: error.message });
    }
  });



// Get books by author (case insensitive)
public_users.get('/author/:author', (req, res) => {
  const authorName = req.params.author.toLowerCase();
  const booksByAuthor = [];

  Object.keys(books).forEach(isbn => {
    const book = books[isbn];
    if (book.author.toLowerCase() === authorName) {
      booksByAuthor.push({ isbn, ...book });
    }
  });

  if (booksByAuthor.length > 0) {
    return res.status(200).json(booksByAuthor);
  } else {
    return res.status(404).json({ message: "No books found by this author" });
  }
});


public_users.get('/author-async/:author', async (req, res) => {
    const authorName = req.params.author.toLowerCase();
  
    try {
      const response = await axios.get(`http://localhost:5000/author/${authorName}`);
      return res.status(200).json(response.data);
    } catch (error) {
      return res.status(404).json({ message: "Author not found using Axios", error: error.message });
    }
  });

// Get books by title (case insensitive)
public_users.get('/title/:title', (req, res) => {
  const titleName = req.params.title.toLowerCase();
  const booksByTitle = [];

  Object.keys(books).forEach(isbn => {
    const book = books[isbn];
    if (book.title.toLowerCase() === titleName) {
      booksByTitle.push({ isbn, ...book });
    }
  });

  if (booksByTitle.length > 0) {
    return res.status(200).json(booksByTitle);
  } else {
    return res.status(404).json({ message: "No books found by this title" });
  }
});

public_users.get('/title-async/:title', async (req, res) => {
    const titleName = req.params.title.toLowerCase();
  
    try {
      const response = await axios.get(`http://localhost:5000/title/${titleName}`);
      return res.status(200).json(response.data);
    } catch (error) {
      return res.status(404).json({ message: "Title not found using Axios", error: error.message });
    }
  });

// Get book reviews by ISBN
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Book not found for the given ISBN" });
  }
});

module.exports.general = public_users;
