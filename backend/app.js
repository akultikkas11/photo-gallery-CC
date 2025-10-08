const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const db = require('./db');
const fs = require('fs');


const app = express();
app.use(cors());
app.use(express.json());
// app.use(express.static('uploads')); // Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/', express.static(path.join(__dirname, '../frontend')));

const storage = multer.diskStorage({
//   destination: './backend/uploads',
  destination: path.join(__dirname, 'uploads'),
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique name
  }
});
const upload = multer({ storage: storage });

// Upload photo
// app.post('/upload', upload.single('photo'), (req, res) => {
//   const { title, description } = req.body;
//   const filename = req.file.filename;

//   const sql = 'INSERT INTO photos (title, description, filename) VALUES (?, ?, ?)';
//   db.query(sql, [title, description, filename], (err, result) => {
//     if (err) {
//       console.error('DB error:', err);
//       return res.status(500).send('Error saving photo metadata');
//     }
//     res.json({ message: 'Photo uploaded successfully' });
//   });
// });
app.post('/upload', upload.single('photo'), (req, res) => {
  const { title, description, userId } = req.body;
  const filename = req.file.filename;

  const sql = 'INSERT INTO photos (title, description, filename, user_id) VALUES (?, ?, ?, ?)';
  db.query(sql, [title, description, filename, userId], (err, result) => {
    if (err) {
      return res.status(500).send('Error saving photo metadata');
    }

    res.json({ message: 'Photo uploaded successfully' });
  });
});


// Get all photos
app.get('/photos', (req, res) => {
  const sql = 'SELECT * FROM photos ORDER BY upload_time DESC';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('DB error:', err);
      return res.status(500).send('Error fetching photos');
    }
    res.json(results);
  });
});

app.get('/my-photos/:userId', (req, res) => {
  const userId = req.params.userId;

  const sql = 'SELECT * FROM photos WHERE user_id = ? ORDER BY upload_time DESC';
  db.query(sql, [userId], (err, results) => {
    if (err) {
      return res.status(500).send('Error fetching photos');
    }

    res.json(results);
  });
});


// Delete photo by ID
app.delete('/photos/:id', (req, res) => {
  const photoId = req.params.id;

  // Get filename from DB first
  const selectSql = 'SELECT filename FROM photos WHERE id = ?';
  db.query(selectSql, [photoId], (err, result) => {
    if (err || result.length === 0) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    const filename = result[0].filename;
    const filepath = path.join(__dirname, 'uploads', filename);

    // Delete image file
    fs.unlink(filepath, (unlinkErr) => {
      if (unlinkErr && unlinkErr.code !== 'ENOENT') {
        console.error('File delete error:', unlinkErr);
        return res.status(500).json({ error: 'Error deleting file' });
      }

      // Delete from DB
      const deleteSql = 'DELETE FROM photos WHERE id = ?';
      db.query(deleteSql, [photoId], (deleteErr) => {
        if (deleteErr) {
          return res.status(500).json({ error: 'Error deleting from DB' });
        }

        res.json({ message: 'Photo deleted successfully' });
      });
    });
  });
});

//registering
app.post('/register', (req, res) => {
  const { email, password } = req.body;

  const sql = 'INSERT INTO users (email, password) VALUES (?, ?)';
  db.query(sql, [email, password], (err, result) => {
    if (err) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    res.json({ message: 'User registered successfully', userId: result.insertId });
  });
});

//login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(sql, [email, password], (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = results[0];
    res.json({ message: 'Login successful', userId: user.id });
  });
});


// Start server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
