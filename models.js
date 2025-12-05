const mongoose = require('mongoose');
const { Schema } = mongoose;

const BookSchema = new Schema({
  title: { type: String, required: true, trim: true },
  comments: { type: [String], default: [] }
});

const Book = mongoose.model('Book', BookSchema);

exports.Book = Book;