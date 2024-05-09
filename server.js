const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Varundeadshot@83',
  database: 'student'
};

const connection = mysql.createConnection(dbConfig);

connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

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

app.post('/students', (req, res) => {
  console.log("request",req.body)
  const { firstName, lastName, age, email, phoneNumber } = req.body;
  const query = 'INSERT INTO student (first_name, last_name, age, email, phone_number) VALUES (?, ?, ?, ?, ?)';
  connection.query(query, [firstName, lastName, age, email, phoneNumber], (err, result) => {
    if (err) {
      console.error('Error creating student:', err);
      res.status(500).json({ error: 'Error creating student' });
      return;
    }
    res.status(201).json({ message: 'Student created successfully', id: result.insertId });
  });
});

app.put('/students/:id', (req, res) => {
  const studentId = req.params.id;
  const { firstName, lastName, age, email, phoneNumber } = req.body;
  const query = 'UPDATE student SET first_name = ?, last_name = ?, age = ?, email = ?, phone_number = ? WHERE id = ?';
  connection.query(query, [firstName, lastName, age, email, phoneNumber, studentId], (err, result) => {
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

app.listen(8080, () => {
  console.log('Server is running on port 8080');
});
