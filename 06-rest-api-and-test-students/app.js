import express from 'express';

const app = express();

const students = [
  { id: 1, name: 'Emma' },
  { id: 2, name: 'John' },
  { id: 3, name: 'Mohamed' }
];

app.get('/students', (req, res) => {

  console.log('GET request received');  

  res.json(students);
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});