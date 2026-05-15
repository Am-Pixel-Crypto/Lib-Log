import express from 'express';
import pg from 'pg';
import axios from 'axios';

const port = process.env.PORT || 3000;
const app = express();
const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

db.connect().then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Connection error', err.stack));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.render('index.ejs');
});

app.get('/search', (req, res) => {
  if (!req.query.q) {
    return res.render('search.ejs', { books: [], q: '' });
  }

  axios.get(`https://openlibrary.org/search.json?q=${req.query.q}`)
    .then(response => {
      const books = response.data.docs.slice(0, 10);
      res.render('search.ejs', { books: books, q: req.query.q });
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Error occurred while fetching search results');
    });
});

app.get('/library', (req, res) => {
  db.query('SELECT * FROM books')
    .then(result => { 
      res.render('library.ejs', { books: result.rows });
    })
    .catch(error => {
      console.error('Error fetching library books:', error);
      res.status(500).send('Error occurred while fetching library books');
    });
});

app.post('/add-book', (req, res) => {
  const { title, cover_i, author_name, rating, notes } = req.body;
  db.query('INSERT INTO books (cover_i, title, authorName, rating, notes) VALUES ($1, $2, $3, $4, $5)', [cover_i, title, author_name, rating, notes])
    .then(() => {
      res.json({ success: true, message: 'Book added to library' });
    })
    .catch(error => {
      console.error('Error adding book:', error);
      res.status(500).json({ success: false, message: 'Error adding book' });
    });
});

app.put('/edit-book', (req, res) => {
  const { cover_i, rating, notes } = req.body;
  db.query('UPDATE books SET rating = $1, notes = $2 WHERE cover_i = $3', [rating, notes, cover_i])
    .then(() => {
      res.json({ success: true, message: 'Book updated successfully' });
    })
    .catch(error => {
      console.error('Error updating book:', error);
      res.status(500).json({ success: false, message: 'Error updating book' });
    });
});

app.delete('/delete-book', (req, res) => {
  const { cover_i } = req.body;
  db.query('DELETE FROM books WHERE cover_i = $1', [cover_i])
    .then(() => {
      res.json({ success: true, message: 'Book deleted successfully' });
    })
    .catch(error => {
      console.error('Error deleting book:', error);
      res.status(500).json({ success: false, message: 'Error deleting book' });
    });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
