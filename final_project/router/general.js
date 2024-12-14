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
    let mypromise = new Promise((resolve,reject) => {
        resolve(books) 
    })
    mypromise.then(books => res.send(JSON.stringify(books)))
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        const {isbn} = req.params
        let data = await new Promise((resolve,reject) => {
            resolve(books) 
        })
        if (!data[isbn]) throw Error("Isbn doesn't exist")
        return res.send(data[isbn])
    } catch(err) {
        return res.status(400).send(err)
    }
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    try {
        const {author} = req.params
        let data = await new Promise((resolve, reject) => {
            resolve(books) 
        })
        const filteredBooks = Object.entries(data).filter(arr => arr[1].author === author)
        if (filteredBooks.length === 0) throw new Error("No books wroten by " + author)
        return res.send(filteredBooks)
    } catch(err) {
        return res.status(400).send(JSON.stringify(err))
    }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    try {
        const {title} = req.params
        let data = await new Promise((resolve, reject) => {
            resolve(books) 
        })
        const filteredBooks = Object.entries(data).filter(arr => arr[1].title === title)
        if (filteredBooks.length === 0) throw new Error("No books titled like " + title)
        return res.send(filteredBooks)
    } catch(err) {
        return res.status(400).send(JSON.stringify(err))
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const {isbn} = req.params
    if (books[isbn]) {
        return res.send(books[isbn].reviews)
    } else {
        return res.status(400).send("Isbn doesn't exist")
    }
});

module.exports.general = public_users;
