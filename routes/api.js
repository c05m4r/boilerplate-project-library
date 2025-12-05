/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const mongoose = require('mongoose');
const Book = require('../models').Book;

const formatListBook = (book) => ({
  _id: book._id,
  title: book.title,
  comments: book.comments,
  commentcount: book.comments.length
});

const formatSingleBook = (book) => ({
  _id: book._id,
  title: book.title,
  comments: book.comments
});

module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res){
      try {
        const books = await Book.find({});
        if (!books) {
          res.json([]);
          return;
        }
        res.json(books.map(formatListBook));
        return;
      } catch (err) {
        res.send([]);
      }
    })
    
    .post(async function (req, res){
      const title = req.body.title && req.body.title.trim();
      if (!title) {
        res.send('missing required field title');
        return;
      }
      const newBook = await Book({ title, comments: [] });
      try {
        const savedBook = await newBook.save();
        return res.json({ _id: savedBook._id, title: savedBook.title });
      } catch (err) {
        res.send('there was an error saving the book');
      }
    })
    
    .delete(async function(req, res){
      try {
        const deleted = await Book.deleteMany({});
        res.send('complete delete successful');
      } catch (err) {
        res.send('there was an error deleting the books');
      }
    });



  app.route('/api/books/:id')
    .get(async function (req, res){
      try {
        const bookID = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(bookID)) {
          return res.type('text').send('no book exists');
        }
        const book = await Book.findById(bookID);
        if (!book) {
          return res.type('text').send('no book exists');
        }
        return res.json(formatSingleBook(book));
      } catch (err) {
        console.error('Failed to fetch book', err);
        return res.status(500).type('text').send('internal server error');
      }
    })
    
    .post(async function(req, res){
      try {
        const bookID = req.params.id;
        const comment = req.body.comment && req.body.comment.trim();
        if (!mongoose.Types.ObjectId.isValid(bookID)) {
          return res.type('text').send('no book exists');
        }
        if (!comment) {
          return res.type('text').send('missing required field comment');
        }
        const book = await Book.findById(bookID);
        if (!book) {
          return res.type('text').send('no book exists');
        }
        book.comments.push(comment);
        await book.save();
        return res.json(formatSingleBook(book));
      } catch (err) {
        console.error('Failed to append comment', err);
        return res.status(500).type('text').send('internal server error');
      }
    })
    
    .delete(async function(req, res){
      try {
        const bookID = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(bookID)) {
          return res.type('text').send('no book exists');
        }
        const deletion = await Book.findByIdAndDelete(bookID);
        if (!deletion) {
          return res.type('text').send('no book exists');
        }
        return res.type('text').send('delete successful');
      } catch (err) {
        console.error('Failed to delete book', err);
        return res.status(500).type('text').send('internal server error');
      }
    });
  
};
