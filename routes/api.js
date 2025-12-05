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
      const bookID = req.params.id;
      try {
        const book = await Book.findById(bookID);
        res.json(formatSingleBook(book));
      } catch (err) {
        return res.send('no book exists');
      }
    })
    
    .post(async function(req, res){
      const bookID = req.params.id;
      const comment = req.body.comment && req.body.comment.trim();
      if (!comment) {
        res.send('missing required field comment');
        return;
      }
      try {
        const book = await Book.findById(bookID);
        book.comments.push(comment);
        book = await book.save();
        res.json(formatSingleBook(book));
      } catch (err) {
        return res.send('no book exists');
      }
    })
    
    .delete(async function(req, res){
      const bookID = req.params.id;
      try {
        const deletion = await Book.findByIdAndDelete(bookID);
        if (!deletion) throw new Error('not found');
          res.send('no book exists');
        res.send('delete successful');
      } catch (err) {
        return res.send('no book exists');
      }
    });
  
};
