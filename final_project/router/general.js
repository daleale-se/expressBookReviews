const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register user
public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    console.log(username, password);
    if (username && password) {
        if (isValid(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }

    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const {isbn} = req.params
    if (books[isbn]) {
        return res.send(books[isbn])
    } else {
        return res.status(400).send("isbn doesn't exist")
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const {author} = req.params
    const filteredBooks = Object.entries(books).filter(arr => arr[1].author === author)
    if (filteredBooks.length > 0) {
        return res.send(filteredBooks);
    } else {
        return res.status(400).send("no books wroten by " + author)
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const {title} = req.params
    const filteredBooks = Object.entries(books).filter(arr => arr[1].title === title)
    if (filteredBooks.length > 0) {
        return res.send(filteredBooks);
    } else {
        return res.status(400).send("no books titled like " + title)
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const {isbn} = req.params
    if (books[isbn]) {
        return res.send(books[isbn].reviews)
    } else {
        return res.status(400).send("isbn doesn't exist")
    }
});

module.exports.general = public_users;
