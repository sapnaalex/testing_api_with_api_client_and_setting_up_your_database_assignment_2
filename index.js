const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// In-memory storage for books
const books = [];

// Create a New Book (C)
app.post('/books', (req, res) => {
  const { book_id, title, author, genre, year, copies } = req.body;

  // Validate input
  if (!book_id || !title || !author || !genre || !year || !copies) {
    return res.status(400).json({ error: 'All book attributes are required.' });
  }

  // Check if the book_id already exists
  const existingBook = books.find(book => book.book_id === book_id);
  if (existingBook) {
    return res.status(409).json({ error: 'A book with this ID already exists.' });
  }

  const newBook = { book_id, title, author, genre, year, copies };
  books.push(newBook);
  res.status(201).json(newBook);
});

// Retrieve All Books (R)
app.get('/books', (req, res) => {
  res.status(200).json(books);
});

// Retrieve a Specific Book by ID (R)
app.get('/books/:id', (req, res) => {
  const { id } = req.params;
  const book = books.find(book => book.book_id === id);

  if (!book) {
    return res.status(404).json({ error: 'Book not found.' });
  }

  res.status(200).json(book);
});

// Update Book Information (U)
app.put('/books/:id', (req, res) => {
  const { id } = req.params;
  const { title, author, genre, year, copies } = req.body;

  const book = books.find(book => book.book_id === id);

  if (!book) {
    return res.status(404).json({ error: 'Book not found.' });
  }

  // Update book attributes if provided
  if (title) book.title = title;
  if (author) book.author = author;
  if (genre) book.genre = genre;
  if (year) book.year = year;
  if (copies) book.copies = copies;

  res.status(200).json(book);
});

// Delete a Book (D)
app.delete('/books/:id', (req, res) => {
  const { id } = req.params;
  const bookIndex = books.findIndex(book => book.book_id === id);

  if (bookIndex === -1) {
    return res.status(404).json({ error: 'Book not found.' });
  }

  // Remove the book
  const deletedBook = books.splice(bookIndex, 1);
  res.status(200).json({ message: 'Book deleted successfully.', book: deletedBook[0] });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
