const express = require('express');
const mysql = require('mysql');
const cors = require('cors'); // Import cors


const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for all routes


// MySQL connection configuration
const dbConfig = {
  host: 'localhost', // Assuming your MySQL server is on the localhost
  user: 'root', // Default username
  password: 'Varundeadshot@83', // Default password
  database: 'student' // Database name
};

// Create MySQL connection
const connection = mysql.createConnection(dbConfig);

// Connect to MySQL
connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Create a new student
app.post('/students', (req, res) => {
  const { firstName, lastName, age, email } = req.body;
  const query = 'INSERT INTO student (first_name, last_name, age, email) VALUES (?, ?, ?, ?)';
  connection.query(query, [firstName, lastName, age, email], (err, result) => {
    if (err) {
      console.error('Error creating student:', err);
      res.status(500).json({ error: 'Error creating student' });
      return;
    }
    res.status(201).json({ message: 'Student created successfully', id: result.insertId });
  });
});

// Get all students
app.get('/students', (req, res) => {
  const query = 'SELECT * FROM student';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching students:', err);
      res.status(500).json({ error: 'Error fetching students' });
      return;
    }
    res.json(results);
  });
});

// Get a student by ID
app.get('/students/:id', (req, res) => {
  const studentId = req.params.id;
  const query = 'SELECT * FROM student WHERE id = ?';
  connection.query(query, [studentId], (err, results) => {
    if (err) {
      console.error('Error fetching student:', err);
      res.status(500).json({ error: 'Error fetching student' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'Student not found' });
      return;
    }
    res.json(results[0]);
  });
});

// Update a student by ID
app.put('/students/:id', (req, res) => {
  const studentId = req.params.id;
  const { firstName, lastName, age, email } = req.body;
  const query = 'UPDATE student SET first_name = ?, last_name = ?, age = ?, email = ? WHERE id = ?';
  connection.query(query, [firstName, lastName, age, email, studentId], (err, result) => {
    if (err) {
      console.error('Error updating student:', err);
      res.status(500).json({ error: 'Error updating student' });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Student not found' });
      return;
    }
    res.json({ message: 'Student updated successfully' });
  });
});

// Delete a student by ID
app.delete('/students/:id', (req, res) => {
  const studentId = req.params.id;
  const query = 'DELETE FROM student WHERE id = ?';
  connection.query(query, [studentId], (err, result) => {
    if (err) {
      console.error('Error deleting student:', err);
      res.status(500).json({ error: 'Error deleting student' });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Student not found' });
      return;
    }
    res.json({ message: 'Student deleted successfully' });
  });
});

// Run the server
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
