# LibLog 📚

A personal book logging app to track books you've read, rate them, and save notes — built with Node.js, Express, and PostgreSQL.

## Features

- Search millions of books via the Open Library API
- Add books to your personal library with a rating and notes
- Edit your rating and notes at any time
- Delete books from your library
- Browse your full reading history

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- EJS
- Bootstrap 5
- jQuery

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/MahmoudMostafa/LibLog.git
cd LibLog
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up the database

Create a PostgreSQL database named `liblog`, then create the table:

```sql
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  cover_i INTEGER,
  title VARCHAR(255) NOT NULL,
  authorname VARCHAR(255),
  rating INTEGER CHECK (rating >= 1 AND rating <= 10),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

Optionally, load the included sample data:

```bash
psql -U postgres -d liblog -f backup.sql
```

### 4. Configure environment variables

Create a `.env` file in the root directory:

```
DB_USER=postgres
DB_HOST=localhost
DB_NAME=liblog
DB_PASSWORD=your_password
DB_PORT=5432
```

### 5. Run the app

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API

Uses the [Open Library Search API](https://openlibrary.org/dev/docs/api) for book search and the [Open Library Covers API](https://openlibrary.org/dev/docs/api/covers) for cover images. No API key required.
